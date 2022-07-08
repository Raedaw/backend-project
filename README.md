# Northcoders News API

Here is my solo backend javascript project.
I have created an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

## Hosted API

please visit https://rachels-nc-notes.herokuapp.com/api which contains a description of all the available endpoints of the API.

## Set-up instructions

Upon forking and cloning this project, in order to install dependencies please run

```
$ npm install
```

You will need to add two files to the root directory of this repo:

1. a file named `.env.development` containing:
   `PGDATABASE=nc_news`

2. a file named `.env.test` containing:
   `PGDATABASE=nc_news_test`

   You will need to see the database using the command:
   `$ npm run seed `

   tests can then be run using the command:

   ```
   $ npm run test
   ```

this project was created using jest v27.5.1 and node.js v18.1.0
