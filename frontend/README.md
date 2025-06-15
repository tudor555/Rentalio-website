# Rentalio - Frontend

This document provides setup and usage instructions for the frontend of **Rentalio**, a rental booking platform built with **Angular** and styled using **Tailwind CSS**.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Running the App](#running-the-app)
5. [Docker Usage](#docker-usage)
6. [Environment Setup](#environment-setup)
7. [Building for Production](#building-for-production)
8. [Troubleshooting](#troubleshooting)
9. [Notes](#notes)

## Project Structure

```
frontend/
├── rental-ui/                  # Main Angular project
│   ├── .angular/
│   ├── .vscode/
│   ├── public/                 # Public favicon
│   ├── src/
│   │   ├── app/                # Angular , components, services
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── app.component.html
│   │   │   ├── app.component.scss
│   │   │   ├── app.component.spec.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.server.ts
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.server.ts
│   │   │   └── app.routes.ts
│   │   ├── assets/             # Static assets (icons, logos, etc.)
│   │   ├── environments/       # Dev and production environment configs
│   │   ├── index.html
│   │   ├── main.server.ts
│   │   ├── main.ts
│   │   ├── server.ts
│   │   └── styles.scss
│   ├── .editorconfig
│   ├── .gitignore
│   ├── angular.json
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   └── tsconfig.spec.json
└── README.md
```

## Tech Stack

- **Angular** (v19.0.5)

- **Tailwind CSS** for styling

- **TypeScript** for logic

- **Docker** for containerized deployment

- Integrated with a **RESTful backend API**

## Installation

### Prerequisites:

- Node.js (v16+),
- NPM (v8+)

From the `/rental-ui/` directory:

```bash
npm install
```

This installs all required dependencies defined in `package.json`.

## Running the App

### Development Mode (Locally)

Run the app on a local dev server with live reloading:

```bash
npm start
```

Or with Angular CLI:

```bash
ng serve
```

Then visit: http://localhost:4200

## Docker Usage

The frontend can be run inside a Docker container. A `Dockerfile` is provided in the `rental-ui `directory.

### Build the Docker image:

```bash
docker build -t rentalio-frontend .
```

### Run the container:

```bash
docker run -d -p 4200:4200 rentalio-frontend
```

You may configure the image to expose port 80 instead, if integrating with a reverse proxy.

## Environment Setup

Environment variables are configured via the file:

```bash
src/environments/environment.ts
```

This file defines values like the backend `apiUrl`. You can update this to point to your local or remote backend server.

### Example Configuration

A sample file is provided in the repo as:

```ts
environment.example.ts;
```

To use it:

1. Copy or rename it to environment.ts:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

2. Update the values inside as needed.

### Production Notes

Currently, there's no separate `environment.prod.ts` in use.

If you need production environments, create that file and configure Angular's build system to use it with:

```bash
ng build --configuration production
```

## Building for Production

Currently, no production pipeline is defined. <br>
However, Angular provides commands for production builds:

```bash
ng build --configuration production
```

This will output the app to `dist/`, ready to be served via **Nginx**, **Apache**, or a static host like **Netlify**/**Vercel**.

Dockerized builds can also be extended to serve production assets using **Nginx**.

## Troubleshooting

- Blank Page or Failed API Calls <br>
  Check if the backend API is running and accessible at the URL defined in `environment.ts`.

- CORS Issues <br>
  Ensure the backend server allows **CORS** and credentials. Angular requests should use `withCredentials: true`.

- Tailwind Not Working <br>
  Make sure Tailwind is properly included via `tailwind.config.js` and `styles.css`.

- Docker Port Conflict <br>
  Ensure port `4200` is available, or map the container to a different port.

## Notes

- The app expects a valid backend running at the defined apiUrl.
- Session handling is done using cookies (`USER-AUTH`).
- Most protected routes and forms depend on successful login.
- Future improvements may include:
  - Lazy loading modules
  - Better production setup
  - **SSR** (Server-side rendering) or pre-rendering
