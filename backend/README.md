# README #

This is the Inven!RA backend repository. 

### Setting up ###

Create a .env file in the root forlder with the following params:
* PORT={The port you desire the backend to run on}
* ENDPOINT={the endpoint you wish the backend to respond on}
* logging={boolean to set logging}
* log_level = info

### Running ###

To start the backend, run the following commands:
* npm install
* npm install bcrypt
* npm install axios
* npm audit fix --force
* npm install moleculer-db-adapter-sequelize sequelize --save
* npm run mol

### Who do I talk to? ###

* Leonel Morgado - Leonel.Morgado@uab.pt
