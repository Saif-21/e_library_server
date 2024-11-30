# eLibrary Server

This is a RESTful API for an eLibrary built with Node.js, Express.js, and TypeScript.

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Create a `.env` file based on the `.env.example` file and fill in the required environment variables
4. Run `npm run dev` to start the development server

## API Endpoints

### Books

-   `GET /get-books`: Get a list of all books
-   `POST /create-book`: Create a new book
-   `GET /get-books?id=`: Get a book by ID
-   `PATCH /update-book/:id`: Update a book
-   `DELETE /delete-book/:id`: Delete a book

### Users

-   `POST /register`: Create a new user
-   `POST /login`: Login a user

## Environment Variables

-   `PORT`: The port number to listen on
-   `NODE_ENV`: The environment to run in (development, production, etc.)
-   `DB_HOST`: The hostname of the database
-   `DB_PORT`: The port number of the database
-   `DB_USERNAME`: The username to use when connecting to the database
-   `DB_PASSWORD`: The password to use when connecting to the database
-   `DB_NAME`: The name of the database
-   `SALT_SIZE`: The size of the salt to use when hashing passwords
-   `JWT_SECRET`: The secret to use when generating JSON Web Tokens

## Development

-   Run `npm run dev` to start the development server

## Production

-   Run `npm run build` to build the application
-   Run `npm run start` to start the production server

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
