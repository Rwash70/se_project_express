# WTWR (What to Wear?): Back End

This back-end project focuses on creating a server for the WTWR (What To Wear Right) application. The goal is to build a robust API that supports user authentication, interaction with a database, and secure handling of requests. This project helps in gaining a deeper understanding of:

Working with databases for data storage and retrieval
Implementing security measures for user authentication and data protection
Writing tests to ensure API functionality
Deploying web applications on a remote machine for production use
Ultimately, the aim is to develop a server that can handle user interactions, process data securely, and provide a reliable API for the front-end.

Technologies and Techniques Used
Node.js: A JavaScript runtime environment used to build the server.
Express: A web framework for Node.js that simplifies the creation of RESTful APIs.
MongoDB: A NoSQL database used for storing application data.
Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js, providing a schema-based solution for data validation and manipulation.
JWT (JSON Web Tokens): Used for implementing secure user authentication and authorization.
Bcrypt: A library for hashing passwords and ensuring secure password storage.
Mocha & Chai: Testing frameworks used for writing and running tests to ensure API reliability and correctness.
dotenv: A module for managing environment variables, such as API keys and database credentials.
Heroku/AWS (optional): Cloud platforms for deploying the application.
Features
User registration, login, and authentication with JWT
CRUD operations for user and clothing items
Secure data handling with password hashing
API testing and security best practices

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
