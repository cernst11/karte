/*!
	canvas-to-tiff 1.7.0
	(c) epistemex.com 2015-2017
	License: CC BY-NC-SA 4.0
*/

"use strict";

/**
 * Static function to convert a CORS-compliant canvas context
 * to a 32-bits TIFF file (buffer, Blob and data-URI).
 *
 * The TIFF is by default saved in big-endian format as interleaved RGBA
 * and ZIP compressed data.
 *
 * @type {{toArrayBuffer: Function, toBlob: Function, toDataURL: Function}}
 * @namespace
 */
 let CanvasToTIFF = {

	/**
	 * @private
	 */
	_dly: 7,

	/**
	 * Convert a canvas to an ArrayBuffer representing a TIFF file.
	 * Includes the alpha channel. The call is asynchronous so a callback
	 * must be provided. The image data is ZIP compressed by default.
	 *
	 * Note that CORS requirements must be fulfilled.
	 *
	 * @param {HTMLCanvasElement} canvas - the canvas element to export
	 * @param {function} callback - called when conversion is done. Argument is ArrayBuffer
	 * @param {object} [options] - an option object
	 * @param {boolean} [options.compress=true] - enable ZIP compression (requires ezlib deflate - if not available it will revert gracefully to uncompressed)
	 * @param {number} [options.compressionLevel=6] - if compression is enabled, defined compression level [0, 9] where 9 is best/slowest.
	 * @param {boolean} [options.littleEndian=false] - set to true to produce a little-endian based TIFF
	 * @param {number} [options.dpi=96] - DPI for both X and Y directions. Default 96 DPI (PPI).
	 * @param {number} [options.dpiX=96] - DPI for X directions (overrides options.dpi).
	 * @param {number} [options.dpiY=96] - DPI for Y directions (overrides options.dpi).
	 * @param {function} [options.onError] - Set error handler
	 * @static
	 */
	toArrayBuffer: function(canvas, callback, options) {

		options = options || {};

		var me 		   = this,
			w          = canvas.width,
			h          = canvas.height,
			pos        = 0,
			offset     = 0,
			iOffset    = 258,
			entries    = 0,
			offsetList = [],
			idfOffset,
			sid        = "canvas-to-tiff 1.6\0",
			lsb        = options.littleEndian,
			dpiX       = +(options.dpiX || options.dpi || 96) | 0,
			dpiY       = +(options.dpiY || options.dpi || 96) | 0,
			canDeflate = typeof ezlib !== "undefined" && typeof ezlib.Deflate !== "undefined",
			compLevel  = typeof options.compressionLevel === "number" ? Math.max(0, Math.min(9, options.compressionLevel)) : 6,
			ctx, idata;

		/*
			Check if we can obtain a 2D context for canvas
		 */
		ctx = canvas.getContext("2d");

		if (!ctx) {
			// could not get a 2D context, make a new internal canvas
			ctx = document.createElement("canvas").getContext("2d");
			if (ctx) {
				ctx.canvas.width = w;
				ctx.canvas.height = h;
				ctx.drawImage(canvas, 0, 0);
			}
			else {
				if (options.onError) options.onError({msg: "Cannot obtain a 2D context."});
				else console.log(e);
			}
		}

		/*
			Get image data
		 */
		idata = (function(ctx) {
			try {
				return ctx.getImageData(0, 0, w, h);	// throws security error (18) if canvas is tainted
			}
			catch (err) {
				if (options.onError) options.onError(err);
			}
		})(ctx);

		/*
			Compress data if compression is enabled / available
		 */
		if (canDeflate && (typeof options.compress === "boolean" ? options.compress : true)) {
			ezlib.deflateAsync(idata.data, {level: compLevel}, function(e) {
				finish(e.result)
			}, function(e) {
				if (options.onError) options.onError(e);
			});
		}
		else finish();

		/*
			Build TIFF file
		 */
		function finish(result) {

			var length = result ? result.length : idata.data.length,
				fileLength = iOffset + length,
				file = new ArrayBuffer(fileLength),
				file8 = new Uint8Array(file),
				view = new DataView(file);

			// Header
			set16(lsb ? 0x4949 : 0x4d4d);							// II or MM
			set16(42);												// magic 42
			set32(8);												// offset to first IFD

			// IFD
			addIDF();												// IDF start
			addEntry(0xfe , 4, 1, 0);								// NewSubfileType
			addEntry(0x100, 4, 1, w);								// ImageWidth
			addEntry(0x101, 4, 1, h);								// ImageLength (height)
			addEntry(0x102, 3, 4, offset, 8);						// BitsPerSample
			addEntry(0x103, 3, 1, result ? 8 : 1);					// Compression (ZIP or raw)
			addEntry(0x106, 3, 1, 2);								// PhotometricInterpretation: RGB
			addEntry(0x111, 4, 1, iOffset, 0);						// StripOffsets
			addEntry(0x115, 3, 1, 4);								// SamplesPerPixel
			addEntry(0x117, 4, 1, length);							// StripByteCounts
			addEntry(0x11a, 5, 1, offset, 8);						// XResolution
			addEntry(0x11b, 5, 1, offset, 8);						// YResolution
			addEntry(0x128, 3, 1, 2);								// ResolutionUnit: inch
			addEntry(0x131, 2, sid.length, offset, getStrLen(sid));	// sid
			addEntry(0x132, 2, 0x14, offset, 0x14);					// Datetime
			addEntry(0x152, 3, 1, 2);								// ExtraSamples
			endIDF();

			// Fields section > long ---------------------------

			// BitsPerSample (2x4), 8,8,8,8 (RGBA)
			set32(0x80008);
			set32(0x80008);

			// XRes PPI
			set32(dpiX);
			set32(1);

			// YRes PPI
			set32(dpiY);
			set32(1);

			// sid
			setStr(sid);

			// date
			setStr(getDateStr());

			// image data
			file8.set(result ? result : idata.data, iOffset);

			// make call async
			setTimeout(function() { callback(file) }, me._dly);

			function getDateStr() {
				var d = new Date();
				return d.getFullYear() + ":" + pad2(d.getMonth() + 1) + ":" + pad2(d.getDate()) + " "
					+ pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());

				function pad2(v) {return v < 10 ? "0" + v : v}
			}

			// helper method to move current buffer position
			function set16(data) {
				view.setUint16(pos, data, lsb);
				pos += 2
			}

			function set32(data) {
				view.setUint32(pos, data, lsb);
				pos += 4
			}

			function setStr(str) {
				var i = 0;
				while(i < str.length) view.setUint8(pos++, str.charCodeAt(i++) & 0xff);
				if (pos & 1) pos++
			}

			function getStrLen(str) {
				var l = str.length;
				return l & 1 ? l + 1 : l
			}

			function addEntry(tag, type, count, value, dltOffset) {
				set16(tag);
				set16(type);
				set32(count);

				if (dltOffset) {
					offset += dltOffset;
					offsetList.push(pos)
				}

				if (count === 1 && type === 3 && !dltOffset) {
					set16(value);
					set16(0)
				}
				else
					set32(value);

				entries++
			}

			function addIDF(offset) {
				idfOffset = offset || pos;
				pos += 2
			}

			function endIDF() {
				view.setUint16(idfOffset, entries, lsb);
				set32(0);

				var delta = 14 + entries * 12;			 // 14 = offset to IDF (8) + IDF count (2) + end pointer (4)

				// compile offsets
				for(var i = 0, p, o; i < offsetList.length; i++) {
					p = offsetList[i];
					o = view.getUint32(p, lsb);
					view.setUint32(p, o + delta, lsb)
				}
			}
		}
	},

	/**
	 * Converts a canvas to TIFF file, returns a Blob representing the
	 * file. This can be used with URL.createObjectURL(). The call is
	 * asynchronous so a callback must be provided.
	 *
	 * Note that CORS requirement must be fulfilled.
	 *
	 * @param {HTMLCanvasElement} canvas - the canvas element to convert
	 * @param {function} callback - called when conversion is done. Argument is a Blob
	 * @param {object} [options] - an option object - see toArrayBuffer for details
	 * @static
	 */
	toBlob: function(canvas, callback, options) {
		this.toArrayBuffer(canvas, function(file) {
			callback(new Blob([file], {type: "image/tiff"}))
		}, options)
	},

	/**
	 * Converts the canvas to an data-URI representing a TIFF file. The
	 * call is asynchronous so a callback must be provided.
	 *
	 * Note that CORS requirement must be fulfilled.
	 *
	 * @param {HTMLCanvasElement} canvas - the canvas element to convert
	 * @param {function} callback - called when conversion is done. Argument is an data-URI (string)
	 * @param {object} [options] - an option object - see toArrayBuffer for details
	 * @static
	 */
	toDataURL: function(canvas, callback, options) {
		this.toBlob(canvas, function(blob) {
			var fr = new FileReader();
			fr.onload = function() {callback(fr.result)};
			fr.onerror = function() {
				if (options && options.onError)
					options.onError({msg: "Error converting data to Data-URI."})
			};
			fr.readAsDataURL(blob)
		}, options)
	}
};

export default CanvasToTIFF;

