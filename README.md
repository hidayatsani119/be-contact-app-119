
# Contact Management API

A RESTful API built with Node.js, Express, and Prisma for managing users, contacts, and addresses. This application serves as the backend for the Contact Management System.

## Technologies Used

* Node.js
* TypeScript
* Express.js
* Prisma ORM
* MySQL
* Zod (Validation)
* Winston (Logging)
* Jest & Supertest (Testing)

## Prerequisites

* Node.js (v16 or higher recommended)
* MySQL Database

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd be-contact-app-119
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file in the root directory.
2.  Define your database connection string in the `.env` file:

    ```env
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    ```

## Database Setup

Run the Prisma migrations to create the necessary tables in your MySQL database:

```bash
npx prisma migrate dev
````

## Running the Application

### Development / Production

1.  Build the TypeScript code to JavaScript:

    ```bash
    npm run build
    ```

2.  Start the application:

    ```bash
    npm start
    ```

The server will start on port 3000 by default.

## Running Tests

This project includes integration tests using Jest. To run the tests, ensure your database is configured correctly and run:

```bash
npm test
```

## API Endpoints

### Public API

  * **POST /api/users**: Register a new user.
  * **POST /api/users/login**: Login user and receive an authentication token.

### Authenticated API

All following endpoints require an `Authorization` header containing the authentication token received upon login.

#### User Management

  * **GET /api/users/current**: Get current user details.
  * **PATCH /api/users/current**: Update current user details.
  * **DELETE /api/users/current**: Logout current user.

#### Contact Management

  * **POST /api/contacts**: Create a new contact.
  * **GET /api/contacts**: Search contacts (supports query parameters: name, email, phone, page, size).
  * **GET /api/contacts/:contactId**: Get a specific contact by ID.
  * **PUT /api/contacts/:contactId**: Update an existing contact.
  * **DELETE /api/contacts/:contactId**: Delete a contact.

#### Address Management

  * **POST /api/contacts/:contactId/addresses**: Create a new address for a contact.
  * **GET /api/contacts/:contactId/addresses**: List all addresses for a contact.
  * **GET /api/contacts/:contactId/addresses/:addressId**: Get a specific address.
  * **PUT /api/contacts/:contactId/addresses/:addressId**: Update an address.
  * **DELETE /api/contacts/:contactId/addresses/:addressId**: Delete an address.

## Project Structure

  * **src/application**: Application setup (web server, database client, logger).
  * **src/controller**: Request handlers for the API.
  * **src/middleware**: Express middleware (auth, error handling).
  * **src/model**: Data models and type definitions.
  * **src/route**: API route definitions.
  * **src/service**: Business logic layer.
  * **src/validation**: Zod schemas for request validation.
  * **test**: Integration tests.
