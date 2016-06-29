# Online pleas
[NJC](http://neighbourhoodjustice.vic.gov.au) has developed a simple prototype in partnership with Code for Australia to allow individuals to submit a guilty plea for minor infringements online. The prototype demonstrates how a guilty plea could be lodged online prior to the scheduled court date for non-complex minor offences - typically these offences comprise nearly 50% of MCV’s case volume.

This prototype was developed using:
* [AngularJS](https://angularjs.org/) v1.5.5
* [ExpressJS](http://expressjs.com/) 4+
* [MongoDB](https://docs.mongodb.com/)
* [npm & nodejs](https://docs.npmjs.com/getting-started/installing-node)
* [Mailgun](https://mailgun.com/) - email delivery

Thanks also to:
* [DigitalOcean](https://www.digitalocean.com) - for hosting
* [Dokku](https://github.com/dokku/dokku) - PaaS

## Screenshots

## Installation
1. Clone the repo
2. Configure your env variables, see the `.env.example` file for the required environment variables. This includes a [mailgun](https://mailgun.com/) api key (feel free to replace with your own mailing service)
3. install all packages `npm install`
4. Build the app `npm install`

## Usage
This app requires npm and nodejs

## Testing
Tests are run using [protractor](www.protractortest.org) follow the installation instructions first and make sure protractor and webdriver are working.

Make sure that:

1. the app is running
2. a selenium session is active
3. `webpack-dev-server` is running

you can use `npm run pre-test` to do both of these, then you can run the e2e tests using `npm run test`. This should start a selenium session in chrome and run through the test suite.

## Deployment


## Credits
* [Ezekiel Kigbo](http://eakigbo.me )
* [Neighbourhood Justice Centre](http://neighbourhoodjustice.vic.gov.au)
* [Code for Australia](https://codeforaustralia.org)
