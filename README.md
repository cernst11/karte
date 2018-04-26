# Karte

Karte is a single page application to generate print size map art using the mapBox api

## Screenshots

![ScreenShot](./screenshots/amsterdam-simple.png?raw=true "Berlin Simple Map")

## Getting Started

These instructions will get a copy of the project up and running on your local machine for development and testing purposes. 
## Prerequisites

* Have `yarn` and the latest version of `node` installed. (Instructions below)

* Have the latest version of `Chrome` of `FireFox` installed. Safari will not work at this time due to missing toBlob support and IE/Edge.... lets be real.

### Keys

* Get a google places API key and a mapBox api key

* [mapBox](https://www.mapbox.com/developers/) Sign up for a key here. Make sure to save the key and keep in a safe place.

* [Google Places](https://developers.google.com/places/web-service/get-api-key) Login/sign up and follow the instructions to create a key and assign to a project. 
I recommend calling the project Karte.

### Dependencies

Installing dependencies MacOS:

* Note: requires brew to be installed

* `brew install yarn` 

* `brew install node` 


Installing dependencies Windows:

* [Yarn](https://yarnpkg.com/lang/en/docs/install/#windows-tab) - Get the Yarn install from the project page.

* [Node](https://nodejs.org/en/) - Get the latest version of node js 8+ from the project page

Installing dependencies Linux:

* Use your package manager of choice to get `Yarn` and `Node` packages


### Installing

Navigate to your workspace using a terminal and clone the repo into it

```
git clone https://github.com/cernst11/karte
```

Go into project directory 

```
cd karte
```
Use a code editor or terminal to add `keys.js` to the `js` directory of the project. This is to create a file to put your mapBox and google api keys in.

Add the following to the keys.js file you just created and add your keys between the single quotes.

```javascript
export default {
        mapBox: 'your mapbox key here',
        googlePlaces: 'your google maps key here'
    }

```

Build the project. This will drop the html, bundle, fonts into the `dist` directory 
```
yarn build 
```

To auto deploy changes after saving a file.
```
yarn watch
```

## Deployment

Start a development server on localhost:8080
```
yarn start 
```


Open `Chrome` or `FireFox` and navigate to localhost:8080 or wherever webpack indicated in the console output.

There are 3 options for export.

* `Map` - Just export the map
* `Overlay` - Just export the overlay
* `Composite` - Export both as a merged image

Using the top most text box you can search for a city. On enter/select the map on the left will navigate to the entred location and place  the center coordinates in the Location Coordinates field on the right.

You can edit any three of the fields using the text boxes before exporting the overlay or composite. 

## Themes/Styles

Map and overlay styles are both configurable. Currently map themes are hardcoded into the Styles.js and are set up as follows

```javascript
{
    name: 'Simpler',
    url: 'mapbox://styles/cernst11/cj28e31au00072tpeqo01n9gf',
    author: 'MapBox',
    overlay:{
        textColor : '#000000',
        ornamentalColor : '#000000',
        gradientColor: '#FFFFFF'
        ornamentalPostition: '106%',
        ornamentalWidth: '3em'
    }
}
```

name: The name of the theme this - must be unique and no spaces

url: specifies the path to the `mapBox` or `Maputnik` theme url.

author: The author/creator of the style

overlay: Specifies the styling for the overlay

textColor: What color the text should be

ornamentalColor: The color of the ornaments next to country

gradientColor: The color of the gradient

## Creating a new theme

Themes can be created using  `mapBox` or `Maputnik`. If you have the ability to host a theme you can create 
a new entry in Styles.js based on the example in Themes/Styles section and point the url key value to url of the theme.

If you can't or don't want to host a theme. The theme can be exported as JSON and added to the `styles` folder. Then you must add the following to the `js\Styles.js` file
below the current imports.

```Javascript
    const nameOfTheme = require('../styles/nameOfTheme.json');
```

Then create a new value based on the example in Themes/Styles section in `Style.js` and use the variable name as the value for the url key value. 

## TODO

* Add more themes


## Built With

* [yarn](https://yarnpkg.com/en/) - Dependency Management
* [webpack](https://webpack.github.io/) - Module Bundler

## Authors

* **Christian Ernst** - *Initial work* - [cernst11](https://github.com/cernst11)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
