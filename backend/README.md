# Rentalio Backend

This is the backend server for the **Rentalio** platform — a rental listing and reservation system designed for users to find, book, and manage property rentals. <br>
The backend is built with **Node.js** and **Express**, and uses **MongoDB** for data persistence.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Project](#running-the-project)
5. [Available Scripts](#available-scripts)
6. [Troubleshooting](#troubleshooting)
7. [Notes](#notes)

## Project Structure

```
backend/
├── api
│    ├── src/
│    │    ├── config-files/               # Configuration files
│    │    ├── controllers/                # Request handlers and logic
│    │    ├── helpers/
│    │    ├── middlewares/                # Custom middleware (auth, logging, validation)
│    │    ├── models/                     # Mongoose models and schema definitions
│    │    ├── routes/                     # Express route definitions
│    │    └── index.ts
│    ├── Dockerfile
│    ├── nodemon.json
│    ├── package-lock.json
│    ├── package.json
│    ├── README.md
│    └──  tsconfig.json
└── README.md
```

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **MongoDB** (for local development, optional if using Docker)
- **Docker** & **Docker Compose**
- **npm** (comes with Node.js)

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/tudor555/Rental-website-license-project.git
cd backend
```

### 2.Install dependencies:

```bash
npm install
```

### 3.Set up environment variables:

Create a `api.env` file under `env/backend_env/api_env/`. <br>
Following the `api.env.example` for create the environment variables. <br>
Also you can remove the `.example` of `api.env.example` and update the values of variables.

```bash
cp api.env.example api.env
```

## Running the Project

### Using Docker Compose (Recommended)

This is the preferred method for running the backend and MongoDB together.

From the project root:

```bash
docker-compose up -d --build
```

The backend will be accessible at:

```
http://localhost:3000 (unless changed via api.env)
```

This automatically runs:

```bash
npm start
```

MongoDB is automatically configured inside the container network and does not require a local install.

### Local Development

```bash
npm run start
```

This will launch the project using `nodemon` with automatic restarts on file changes. Requires a running local MongoDB instance if Docker is not used.

## Available Scripts

The backend project uses minimal custom scripts, relying on `nodemon` for development and Docker for containerized environments.

Starts the server using **nodemon**:

```bash
npm start
```

### `nodemon.json` Configuration

The project uses **nodemon** for automatic server reloads during development. The configuration is defined in a `nodemon.json` file:

```
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "exec": "ts-node ./src/index.ts"
}
```

- watch: Monitors changes in the src/ directory.
- ext: Reloads on changes to .ts and .js files.
- exec: Runs the application entry point with ts-node.

This setup enables smooth TypeScript development without manual compilation or restarts.

No additional configuration is required to run the **backend** locally — just ensure **ts-node** and **nodemon** are installed (they're already listed as **devDependencies**).

## Troubleshooting

### Docker Issues

- Ensure Docker and Docker Compose are running and up to date.
- Check for port conflicts (default is 3000).
- If MongoDB fails to connect, verify MONGODB_URL in api.env matches the Docker container service.

### MongoDB Connection

- Verify credentials or connection string format.

### Common Fixes

- Delete `node_modules` and `package-lock.json`, then reinstall:

```bash
rm -rf node_modules package-lock.json && npm install
```

- Check `api.env` file for missing or incorrect variables.

## Notes

- The backend is fully integrated with the frontend and database layers.

- A default **admin user** is created during the database migration process — no seeders needed for user setup initially.

- API logic is modular and covered in detail in the [API Documentation](https://github.com/tudor555/Rental-website-license-project/tree/project-dev/backend/api#readme).

- All schema-level validation is handled via **Mongoose**.

- Logging and error-handling middleware ensure clear and maintainable logic flow.
