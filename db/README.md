# Database Migration Rentalio

## Overview

This project provides a series of scripts to manage MongoDB database and collection creation using TypeScript. \
The scripts cover the initialization of essential collections for a platform that deals with user management, listings, reservations, payments, and more.

The project uses TypeScript along with `ts-node` to execute migration scripts seamlessly.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Migration Script](#migration-script)
5. [Database and Collection Initialization](#database-and-collection-initialization)
6. [Troubleshooting](#troubleshooting)
7. [Notes](#notes)

## Project Structure

```
src/
│
├── config/
│   └── dbConfig.ts             # Database connection configuration
│
├── migrations/
│   ├── createDatabase.ts               # Script to create the database
│   ├── createUsersCollection.ts        # Migration script for the users collection
│   ├── createListingsCollection.ts     # Migration script for the listings collection
│   ├── createReservationsCollection.ts # Migration script for the reservations collection
│   ├── createFlightsCollection.ts      # Migration script for the flights collection
│   ├── createReviewsCollection.ts      # Migration script for the reviews collection
│   └── createPaymentsCollection.ts     # Migration script for the payments collection
│
├── package-lock.json
├── pacakge.json                 # Project dependencies and scripts
├── README.md                    # Documentation of project
└── tsconfig.json
```

## Prerequisites

Ensure you have the following installed:

- Node.js (v16 or higher)
- MongoDB (Running instance)
- Docker-Compose (Recomand for run MongoDB instance)

## Installation

1. Clone the repository:

```bash
git clone <https://github.com/Tudor555/Rental-website-license-project.git>
cd db
```

2. Install dependencies:

```bash
npm install
```

3. Configure your environment:

Create a `db.env` file under `env/db_env/`. \
Following the `db.env.example` for create the environment variables. \
Also you can remove the `.example` of `db.env.example` and update the values of variables.

## Migration Script

The project provides scripts to initialize the database and create collections.

### Run All Migrations

To run all migration scripts in sequence (database creation followed by collection initialization):

```bash
npm run migrate:all
```

### Run Specific Migrations

Run individual collection migrations:

```bash
npm run migrate # Create database
npm run migrate:users # Create users collection
npm run migrate:listings # Create listings collection
npm run migrate:reservations # Create reservations collection
npm run migrate:flights # Create flights collection
npm run migrate:reviews # Create reviews collection
npm run migrate:payments # Create payments collection
```

## Database and Collection Initialization

- Database: The `createDatabase.ts` script initializes the MongoDB database.
- Collections:
  - Users: Manages user profiles and authentication.
  - Listings: Stores property listings for rental or booking.
  - Reservations: Tracks booking records for listings.
  - Flights: Holds information about flights (fetched from external APIs).
  - Reviews: Manages user reviews on listings.
  - Payments: Tracks payments made for reservations.

## Troubleshooting

If you encounter issues during running this project, here are some common solutions:

- If you encounter TypeScript compilation errors, ensure your `tsconfig.json` are correctly configure.
- MongoDB connection issue: verify your `.env` file have the correct configuration.
- Environment variable not loaded: ensure the `.env` file is created in `env/db_env/`and correctly referenced in the script.

## Notes

The project enforces schema validation at the **API** level using tools like **Mongoose** (not directly in the migration scripts).
