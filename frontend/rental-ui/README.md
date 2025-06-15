# RentalUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.5.

## Table of Contents

1. [Development Server](#development-server)
2. [Code Scaffolding](#code-scaffolding)
3. [Building](#building)
4. [Environment Configuration](#environment-configuration)
5. [Testing](#testing)
6. [Project Structure](#project-structure)
7. [Used Libraries](#used-libraries)
8. [Additional Resources](#additional-resources)

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Environment Configuration

Environment variables are defined in:

```bash
src/environments/environment.ts;
```

A sample file is available:

```bash
src/environments/environment.example.ts;
```

You can copy it and modify values as needed:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

For production builds, you may add a separate `environment.prod.ts` configuration and build using:

```bash
ng build --configuration production
```

## Testing

Unit tests are not currently implemented.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Project Structure

The main parts of the app are organized under:

```
src/app/
├── components/         # Shared and layout components
├── pages/              # Page components (login, home, listing, etc.)
├── services/           # HTTP services for API calls
├── app.component.html
├── app.component.scss
├── app.component.spec.ts
├── app.component.ts
├── app.config.server.ts
├── app.config.ts
├── app.routes.server.ts
└── app.routes.ts
```

## Used Libraries

This frontend uses:

- [TailwindCSS](https://tailwindcss.com/) – Utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) – Icon support

Angular built-in features like HttpClient, Router and reactive forms.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

TailwindCSS: [Docs](https://tailwindcss.com/)
