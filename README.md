# Northcoders News API

Welcome to the Northcoders News API. This projects serves as a backend service that provides application data programatically. Similar to real-world platforms such as Reddit, it aims to deliver information to the front-end architecture.

Visit the hosted database here: https://backend-project-nc-news-t9vr.onrender.com/api/

To get started, clone this GitHub repository: git clone https://github.com/grace-hartley/be-nc-news.git

Make sure you have the following installed on your machine:

- Node.js
- PostgreSql

Once you have navigated to the project directory, ensure you have installed the dependencies:
npm install

Create two .env files in the project root:

- .env.test for testing environment
- .env.development for development environment

Into each, add 'PGDATABASE=', with the correct database name. Please see /db/setup.sql for the database names. Please ensure these .env files are included in the .gitignore file.

To run database setup script: npm run setup-dbs

To seed the local database: npm run seed

To run tests, used the following command: npm test
