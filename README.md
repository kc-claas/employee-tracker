# Employee Tracker
[![Static Badge](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)
## Description
This application allows a user to build and manage a database for their business' departments, roles, and employees. It can also be used to view this  data from the database in a variety of manners.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)
- [Test](#test)
- [Questions](#questions)

## Installation
You will need to have node.js and postgres installed to use this application. To install, first copy the root directory to the destination of your choice. From there, you will need to create a .env file in that root directory, which will contain 3 lines: DB_NAME=employee_roster, DB_USER=(your postgresql username), and DB_PASSWORD=(your postgresql password). Next, open the root directory in your terminal and enter 'npm install' to install the necessary node modules.

## Usage
Prior to using the application, you'll need to have your database created. To do this, from the root directory open postgres in the terminal and enter '\i db/schema.sql' to create your database. Note that this will delete any existing employee_roster database, so only do this if you're sure you want to start your database over from scratch. 

To use the application, open the root directory in your terminal and enter 'node index.js'. You will be prompted to select which actions you which to perform on your database. After each action, you'll be brought back to this menu, and you can exit the application by choosing the 'exit' option. A brief demonstration of the applications usage can be found [here](https://drive.google.com/file/d/1MvFeF2tk6K2vIwh_UlDnTtdCF_VylkkQ/view).

## License
This application is covered under the [MIT](./LICENSE) license

## Contribution
If you'd like to contribute, you may contact me using the information below.

## Test
If you'd like to test the application, you can use the seeds file to populate the database with a few example entries. To do so, after opening the root directory in your postgres terminal and entering '\i db/schema.sql' to re-create the database, enter '\i db/seeds.sql' to run the seeds file. From there, you can run the application to view the seeded entries and test out the functionality. Be sure to run '\i db/schema.sql' again once you're done testing, to drop and re-create your database from scratch.

## Questions
Github: [kc-claas](https://github.com/kc-claas)

For additional questions, contact keithclaas@gmail.com
