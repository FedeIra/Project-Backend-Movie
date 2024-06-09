# Movie Challenge Backend

This project is a backend application HTTP REST API.

The API provides endpoints to:

- Fetch movies,
- Fetch TV show details,
- Register users,
- Login users,
- Refresh JWT access token, and
- Add movies or TV shows to a user's wishlist.

The project follows clean architecture principles to ensure a well-organized and maintainable codebase.

## Table of Contents

- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [License](#license)

## Project Structure

Below is the organized structure of folders and files in the project:

```
backend-nodejs
├── packages
│    ├── clients
│    │   ├── tmdbClient
│    │   └── dataBaseClient
│    ├── env
│    │   └── config.ts
│    ├── errors
│    │   └── ...
│    └── fastify
├── server
│   ├── handlers
│   │   └── ...
│   ├── errors.ts
│   └── main.ts
├── src
│   ├── models
│   │   └── ...
│   ├── services
│   │   ├── movies
│   │   ├── tvShows
│   │   └── users
│   └── useCases
│       ├── movies
│       ├── tvShows
│       └── users
├── package.json
├── package-lock.json
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
└── .env
```

## Architecture

This project follows the principles of Clean Architecture to ensure that the system is easy to understand, maintain, and extend.

The project is divided into three main layers:

1. **Handlers or Delivery Layer**: This layer contains the HTTP handlers that receive incoming HTTP requests, call the appropriate use case, and return the HTTP response. The handlers are responsible for parsing the request, validating the input, and returning the response.

```json
├── server
│   ├── handlers
│   │   └── ...
│   ├── errors.ts
│   └── main.ts
```

2. **Use Cases or Application Layer**: This layer contains the use cases that represent the application's business rules. Each use case is a class that implements a specific feature of the application. The use cases are independent of the delivery mechanism (HTTP, CLI, etc.) and the data access layer (database, external services, etc.). Use cases interact with the services to perform specific tasks, ensuring that the business rules are enforced.

```json
│   └── useCases
│       ├── movies
│       ├── tvShows
│       └── users
```

3. **Services or Data Access Layer**: This layer contains the services that interact with external data sources such as databases (i.e: mongoDB), external APIs (i.e: TMBD APIs), etc. The services in this layer are responsible for fetching and storing data from and to external sources.

```json
│   ├── services
│   │   ├── movies
│   │   ├── tvShows
│   │   └── users
```

**Example of flow:**

Here is a brief overview of how a request flows through the system:

1. Handler: The client sends an HTTP request to the server, which is received by a handler. Handlers are responsible for parsing the request using a schema (e.g., Zod), mapping the input data to the correct format if required and calling the appropriate use case.
2. Use Case: The use case is responsible for enforcing the business rules and orchestrating the flow of data between the services if required.
3. Service: If interaction with a a service is required by use case, services are required to perform its tasks (e.g., fetching data from a database, calling an external API, etc.) and return the result to the use case.
4. Response: The use case returns the result to the handler, which then sends the response back to the client.

The main objective of this architecture is to keep the business rules isolated from the delivery mechanism and the data access layer, making the system more flexible, testable, and maintainable by following the SOLID principles:

- **Separation of concerns**: Each layer has a specific responsibility and is isolated from the other layers.
- **Dependency Rule**: Inner layers should not depend on outer layers. The flow of dependencies is always inward. For example, the business logic layer or use cases does not know anything about the delivery layer or the data access layer (services).
- **Encapsulation**: Each layer hides its implementation details from other layers.
- **Interface Adapters**: The use of interfaces allows the system to be easily adapted to different frameworks or libraries.

Below, an image of clean architecture is shown:

![Clean Architecture](./assetsDocumentation/CleanArchitecture.jpg)

Please note flow of data. Handler ("Controller") receives the request, then it calls the use case, which may or may not interact with services (DB, External Interfaces, etc.). The use case returns the response to the controller ("Presenter"), which sends the response back to the client.

Entities (in our development "Models") are the objects that represent the core business objects of the application. They are independent of the data access layer object (in our development "Entities").

Below, an image the architecture of the project is shown:

![Project Architecture](./assetsDocumentation/Architecture.drawio.png)

## Tech Stack

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **TypeScript**: A superset of JavaScript that adds static types to the language.
- **Fastify**: A fast and low overhead web framework for Node.js.
- **MongoDB**: A NoSQL database that stores data in flexible, JSON-like documents.
- **Docker**: A platform for developing, shipping, and running applications in containers.
- **Docker Compose**: A tool for defining and running multi-container Docker applications.
- **JWT**: JSON Web Tokens are an open, industry-standard RFC 7519 method for representing claims securely between two parties.
- **TMDB API**: The Movie Database (TMDb) API is a resource for any developers that want to integrate movie, TV show, and cast data in their application.

## Installation

1. git clone https://github.com/your-repo/movie-challenge-backend.git

2. You can use branches master or develop.

3. cd backend-nodejs

4. npm install

## Environment Variables

Create a `.env` file in the root of the project and add the following environment variables. You can check for such purpose the `.env.example` file in the root of the project:

```bash
PORT=3000
HOST=0.0.0.0
TMDB_API_KEY=your-tmdb-api-key
TMDB_BASE_URL=https://api.themoviedb.org/3
CONNECTION_STRING_DB=your_mongodb_connection_string
DB_NAME=Movie-Challenge
USER_COLLECTION_NAME=Users
JWT_SECRET=your-secret-key
```

## Running the Project

To run the project, you need to have a MongoDB instance running on your machine. You can either install MongoDB locally or use a cloud-based MongoDB service like MongoDB Atlas.

### Using Docker:

1. Create a `.env` as previous described.

2. Check Docker is installed and running on your machine.

3. Build and run the containers:

```bash
docker-compose up --build
```

### Without Docker:

1. Create a `.env` as previous described.

2. Ensure MongoDB is installed and running.

3. Run the following command to start the server:

```bash
npm run dev
```

You can also run:

```bash
npm start
```

## API Endpoints

- Fetch Movies

  - URL: /movies
  - Method: POST
  - Body:

    ```json
    {
      "filters": {
        "genre": "string",
        "recommended": "boolean",
        "year": "number"
      },
      "sorts": {
        "byDate": "boolean",
        "byAverage": "boolean"
      }
    }
    ```

Note: This endpoint does not require authentication. In most cases, applications and websites allows users to browse movies without being logged in. However, if you want to add a movie to the wishlist or watch more details, you need to be authenticated. This is a common practice in the industry.

Example of response:

```json
[
  {
      "id": 786892,
      "title": "Furiosa: A Mad Max Saga",
      "poster": "https://image.tmdb.org/t/p/original/aKrDLfQX30tHaTIC2ZRAxG2PbQw.jpg/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
      "description": "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus. Sweeping through the Wasteland they come across the Citadel presided over by The Immortan Joe. While the two Tyrants war for dominance, Furiosa must survive many trials as she puts together the means to find her way home.",
      "average": 7.686,
      "releaseDate": "2024-05-22",
      "genres": [
          "Action",
          "Adventure",
          "Science Fiction"
      ]
  },
  {
      "id": 573435,
      "title": "Bad Boys: Ride or Die",
      "poster": "https://image.tmdb.org/t/p/original/aKrDLfQX30tHaTIC2ZRAxG2PbQw.jpg/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg",
      "description": "After their late former Captain is framed, Lowrey and Burnett try to clear his name, only to end up on the run themselves.",
      "average": 7.478,
      "releaseDate": "2024-06-05",
      "genres": [
          "Action",
          "Crime",
          "Thriller"
      ]
  },
  ...
]
```

- Fetch TV Show Details

  - URL: /tvshow-details
  - Method: POST
  - Authorization Header:

    ```json
      Bearer Token <token>
    ```

  - Body:

    ```json
    {
      "tvshowId": "string"
    }
    ```

Example of response:

```json
{
    "id": 15,
    "title": "Mister Rogers' Neighborhood",
    "poster": "https://image.tmdb.org/t/p/original/qhbeRYVg120cBmc9XvGxvk6EmJF.jpg",
    "average": 5.351,
    "releaseDate": "1968-02-19",
    "genres": [
        "Kids"
    ],
    "numberOfSeasons": 31,
    "director": [
        {
            "id": 1074129,
            "credit_id": "52532eb819c295794000402c",
            "name": "Fred Rogers",
            "original_name": "Fred Rogers",
            "gender": 2,
            "profile_path": "/d000aVyO5zYls7MrSCU6EhG4eoz.jpg"
        }
    ],
    "seasons": [
        {
            "seasonNumber": 0,
            "seasonId": 246353,
            "releaseDate": "1968-06-07",
            "totalEpisodes": 1
        },
        {
            "seasonNumber": 1,
            "seasonId": 137656,
            "releaseDate": "1968-02-19",
            "totalEpisodes": 130
        },
        ...
    ]
}
```

- Register User

  - URL: /register-user
  - Method: POST
  - Body:

  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string"
  }
  ```

  Example of response:

  ```json
  {
    "username": "Ejemplo2",
    "email": "Ejemplo2@gmail.com",
    "wishList": [],
    "createdAt": "2024-06-08T19:09:10.488Z"
  }
  ```

- Login User

  - URL: /login
  - Method: POST
  - Body:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

  Example of response:

  ```json
  {
    "username": "Ejemplo1",
    "email": "Ejemplo1@gmail.com",
    "wishList": [
      {
        "title": "Rush Hour",
        "id": 123123,
        "image": "posterExample",
        "_id": "6663e2feaa6483ee107b538d"
      },
      {
        "title": "Lord of the rings",
        "id": 876345,
        "image": "posterExample4",
        "_id": "6663e31baa6483ee107b5394"
      },
      {
        "title": "Lord of the rings 3",
        "id": 8763,
        "image": "posterExample2",
        "_id": "6663ec122881baa2859fe579"
      }
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- Refresh JWT Access Token

  - URL: /refresh-token
  - Method: POST
  - Authorization Header:

    ```json
      Bearer Token <token>
    ```

  - Body:

  ```json
  {
    "currentToken": "string"
  }
  ```

  Example of response:

  ```json
  {
    "newToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- Add Movie or TV Show to Wishlist

  - URL: /add-to-wishlist
  - Method: POST
  - Authorization Header:

    ```json
      Bearer Token <token>
    ```

  - Body:

  ```json
  {
    "userId": "string",
    "mediaId": "string",
    "mediaType": "string"
  }
  ```

  Example of response:

  ```json
  {
    "message": "Added to wishlist. Enjoy!"
  }
  ```

## Error Handling

Errors are handled using custom error classes to provide structured error responses. The following error classes are defined:

- CustomError: Base class for all custom errors.
- ClientError: Represents client-side errors (status code 400).
- ServerError: Represents server-side errors (status code 500).
- UnauthorizedError: Represents authentication errors (status code 401).

Errors are caught in the Fastify error handler (error.ts) and sent as a response to the client.

```json
├── server
│   ├── handlers
│   │   └── ...
│   ├── errors.ts
│   └── main.ts

```

Some examples of error responses:

```json
{
  "errorCode": 400,
  "error": "Bad request.",
  "validationErrors": [
    {
      "path": "username",
      "message": "Expected string, received number"
    }
  ]
}
```

```json
{
  "errorCode": 500,
  "error": "Internal server error.",
  "errorDetails": {
    "message": "Email already in use.",
    "stack": "Error: Email already in use.\n    at DataBaseServices.registerUser (file:///app/src/services/users/userService.ts:47:15)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at async RegisterUserUseCase.registerUser (file:///app/src/useCases/users/registerUserUseCase.ts:31:12)\n    at async Object.<anonymous> (file:///app/server/handlers/registerUserHandler.ts:37:9)"
  }
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](./assetsDocumentation/LICENSE.txt) file for details.

## Author

Federico Irarrazaval

- LinkedIn: https://www.linkedin.com/in/federicoirarrazaval/?locale=en_US
- Email: fedeirar@gmail.com
- Portfolio: https://portfolio-fedeira.vercel.app/
- GitHub: https://github.com/FedeIra
