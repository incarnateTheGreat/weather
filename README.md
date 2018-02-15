# Weather

## Prerequisite

To operate the application, you must have `Angular 4` installed on your system. To install, go to [Angular 4](https://cli.angular.io/) for instructions on how to get started.

This application utilizes the [Dark Sky API](https://darksky.net/dev) to gather weather data.

## Installation

Prior to running the Development Server, you must download the latest dependencies for this project. You will need [Node](https://nodejs.org/en/) and [NPM](https://docs.npmjs.com/getting-started/installing-node).

Run the following from the Command Line:

```
git clone https://github.com/incarnateTheGreat/weather.git

cd weather
```

Once the above steps are complete, download the latest dependencies by running:

```
npm install
```

## Development Server

1) From the Command Line, go to the home path that has the folder `weather`.
2) Run `ng serve` to start the dev server.
3) The app will automatically reload if you change any of the source files.
4) In the Command Line Interface, open a new Terminal window and go to the folder called 'server'.
5) Run `node server.js` to start the data server.
6) Navigate to `http://localhost:4200/`.

## Operations

The page renders a Select box with a list of Cities. Choose one of the cities and the weather for the selection
should render.
