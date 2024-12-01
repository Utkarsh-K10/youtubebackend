#This is a youtube backend project 
we are going to build a streaming project

# First phase of project 

 A-> setting up project 
   1. required package
   2. folder structure
   3. package.json file configuration
   4. prettier/ prettierIgnore, gitIgnore/ .env
   5. git initialization

B-> setting up database
   1. creating mongodb atlas account and required username and password.
   2. configuration of the .env file and constants of project.
   3. adding dotenv, mongoose, express packages in project.
   4. dotenv ES6 type casting and configuration with experimental flag. 
   5. adding entry in package.json under "dev" dotenv/config, experimental-feature.
   6. setting up index file to conect to the database and express application running on PORT.

C-> setting up utils files for handling of reoccuring tasks and error.
   1. First util is for async handler which act as the wrapper for the various mongodb connection tasks.
   2. There are two ways of setting up the utils - first is to use promise concept and second one is by using the try-catch.
   3. Making wrapper for the custom error handling using the class and default API error class.
