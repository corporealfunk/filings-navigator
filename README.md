# README

This is my implementation of the filings app. It uses a MySQL database and React on the frontend. It can be used in Docker, or run on Dokku (self-hosted Heroku-like platform). You can visit my Dokku installation at: http://filings-navigator.dokku.moniaci.net

Note that this project is using ruby 3.1.3 and node 16 for js compilation and bundling. You can use rbenv and nvm to manage versions.

## General Notes:

I chose React and am bundling with webpack. It's been a while since I've used React, and I actually wouldn't reach for it for a project like this. I'd much rather use Hotwire/Turbo/Stimlus for a project of this scope and it would work really well.

Data loading from the XML files on the web is done via the task located at `app/lib/tasks/filings.rake`

The only task defined calls out the code in the class located at `app/models/filing_mapper.rb`

The rake task and loading code is idempotent, you can run it as many times as you like.

There are lots of "TODO:" notes all over the code, and there's lots to-do, for sure. I haven't really combed for N+1 queries, definitely some optimizations there. The API views in jbuilder often include data that not every front end call would need, plenty of room for optimization and improvement there. As mentioned, I haven't used React since "useEffect" and some of the other lifecycle methods became a thing, I'm used to the older class definitions and "componentDidMount" type of lifecycle methods, so some of the React code for sure needs a look. There are better ways to load data during ReactRouter route updates, but I'm doing it in-component instead of in the router code. There are times when the front end calls the API twice just to render one view, that should be addressed as well, from an API perspective but also more efficient data loading on the frontend.

I would usually lint all my JS with eslint and AirBnB JS rules. I did not do this for this project.

I would probably do a lot more testing, I did test the XML parsing code as I wrote it to make dev a little faster there.

Also -- there are lots of unused gems and I did not comb through that! Also, the app is loading ActionCable and ActiveStorage and other Rails bits that are simply not needed. That should all be removed, and we should only load the Rails stuff we need, but I didn't comb through the config for this.

## Run on Localhost:

If you run on localhost, you'll need a mysql database running, grant all access to a user and create a .env file with those credentials, like so:

echo 'DATABASE_URL="mysql2://user:pass@localhost/db_name"' > .env

Then:

- `bundle install`
- `yarn install`
- `./bin/rails db:reset`
- `./bin/rails filings:import_xml`
- `./bin/dev`

visit:
http://localhost:3000



## Run with Docker:

To get this up and runing on Docker with docker compose. Clone the repo and then from the code directory:

build:
- `docker-compose build`

bundle install, yarn install and reset the db:
- `docker-compose run --rm app sh -c "bundle install -j8 && yarn install && rails db:reset`

bring up all containers:
- `docker-compose up -d`

import the filings data from the web:
- `docker-compose exec app ./bin/rails filings:import_xml`

visit:
http://localhost:3000

shutdown:
- `docker-compose down`

NOTE: do not have a .env file that declares a DATABASE_URL as this will override the env var set in the docker-compose.yml file

## Run on a Dokku Installation (Heroku clone):

You can run this on Dokku! And probably Heroku, though I've only put it on Dokku since Heroku got rid of their free tier:

On the Dokku Server as root:
- `dokku apps:create filings-navigator`
- `dokku mysql:create filingsdb`
- `dokku mysql:link filingsdb filings-navigator`
- `dokku config filings-navigator` # get the DATABASE_URL THEN:
- `dokku config:set filings-navigator DATABASE_URL:<variable_from above, edit to start with mysql2>

On your localhost in the cloned code respository:
- `git remote add dokku dokku@yourdomain.com:filings-navigator`
- `git push dokku master`

On the Dokku server as root:
- `dokku run filings-navigator rails db:reset`
- `dokku run filings-navigator rails filings:import_xml`

visit:
http://filings-navigator.yoursub.domain.com



# Original README:

## Installation

- `bundle install`

## Prepare DB

- `rake db:migrate`
- **_ TODO _**

## Running the server

- `rails s`

### Total time: ~12 hours

## Background Information

Every year, US Nonprofit organizations submit tax returns to the IRS. The tax returns are converted into XML and made available by the IRS. These tax returns contain information about the nonprofit’s giving and/or receiving for the tax period. For this coding project, we will focus on the nonprofit’s attributes and the awards that they gave or received in a particular tax year.

These Organizations may file their taxes multiple times in a year (also known as filing amended returns). Only one return is considered valid, however. The valid return is the one with the most recent `ReturnTimestamp` (and/or the one with the `Amended Return Indicator`).

## Key Definitions

- Filers are nonprofit organizations that submit tax return data to the IRS.
- Awards are grants given by the filer to nonprofit organizations in a given year.
- Recipients are nonprofit organizations who have received awards given by a filer.
- Filings are the individual tax returns submitted by filers to the IRS for a given tax period. A filing contains awards given by the filer to recipients.

Example: "The filer’s 2015 filing declares that they gave 18 awards to 12 different recipients totalling $118k in giving"

## Backend Requirements

**Build a Rails or Sinatra web application that parses the IRS XML and stores the data into a database**

- Parse and store ein, name, address, city, state, zip code info for both filers and recipients
- Parse and store award attributes, such as purpose, cash amount, and tax period
- Generate an API to access the data. This API should support
  - Serialized filers
  - Serialized filings by filer
  - Serialized awards by filing
  - Serialized recipients
- Consider additional request parameters by endpoint (e.g. filter recipients by filing, filter recipients by state, filter recipients by cash amount, pagination, etc).
- Be sure to read the [Frontend Requirements](#frontend-requirements) when building and extending the API!
- Bonus points for deploying to Heroku

## Filing Urls

- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201612429349300846_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201831309349303578_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201641949349301259_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201921719349301032_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/202141799349300234_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201823309349300127_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/202122439349100302_public.xml
- https://filing-service.s3-us-west-2.amazonaws.com/990-xmls/201831359349101003_public.xml

## Paths and Keys in XMLs for Related Data

- Filing Path: `Return/ReturnHeader`
  - Return Timestamp: `{ReturnTs}`
  - Tax Period: `{TaxPeriodEndDt,TaxPeriodEndDate}`
- Filer Path: `Return/ReturnHeader/Filer`
  - EIN: `EIN`
  - Name: `{Name,BusinessName}/{BusinessNameLine1,BusinessNameLine1Txt}`
  - Address: `{USAddress,AddressUS}`
  - Line 1: `{AddressLine1,AddressLine1Txt}`
  - City: `{City,CityNm}`
  - State: `{State,StateAbbreviationCd}`
  - Zip: `{ZIPCode,ZIPCd}`
- Award List Path: `Return/ReturnData/IRS990ScheduleI/RecipientTable`
  - Amended Return Indicator: `{AmendedReturnInd}`
  - EIN: `{EINOfRecipient,RecipientEIN}`
  - Recipient Name: `{RecipientNameBusiness,RecipientBusinessName}/{BusinessNameLine1,BusinessNameLine1Txt}`
  - Recipient Address: `{USAddress,AddressUS}`
    - Line 1: `{AddressLine1,AddressLine1Txt}`
    - City: `{City,CityNm}`
    - State: `{State,StateAbbreviationCd}`
    - Zip: `{ZIPCode,ZIPCd}`
  - Award Amount: `{AmountOfCashGrant,CashGrantAmt}`

\* Paths may vary by schema version

## Frontend Requirements

Go ahead and show off! Build something fun that utilizes the API. Consider building a UI that enables a customer to explore the historical giving of a filer. What information is relevant? How should someone navigate the data? Obviously, you don’t have infinite time, so feel free to stub out functionality or leave comments for things you didn’t get around to finishing. We understand!

The only requirements for the frontend are that you leverage your new API in Javascript (please, no Backbone.js).

## How to deliver your code

Please fork this repo into a Github repository and share access with the following Github accounts.

- [@eyupatis](https://github.com/eyupatis)
- [@gsinkin-instrumentl](https://github.com/gsinkin-instrumentl)
- [@instrumentl707](https://github.com/instrumentl707)
- [@roguelazer](https://github.com/roguelazer)
- [@bchaney](https://github.com/bchaney)

## Questions or Issues

Please don’t hesitate to contact engineering@instrumentl.com
