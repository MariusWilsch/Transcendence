---
runme:
  id: 01HFPJ3Z053V0GXPSFSV0M4N50
  version: v2.0
---

# Backend Structure Documentation

### Project Structure Design
- Modular Structure with Layered Architecture
- Atomic Design

## Overview

This document outlines the backend structure for the `ft_transcendence_project`. The backend is developed using NestJS, providing a robust and scalable server-side application.

## Main Files and Directories

- `README.md`: A guide to the backend application, including setup and usage instructions.
- `package.json` and `package-lock.json`: Manage project dependencies and ensure consistent installations.
- `prisma/`: Contains the Prisma ORM configuration and schema for database interactions.
- `dist/`: The compiled output directory of the NestJS application, generated during the build process.

## Source Directory (`src/`)

- `app.module.ts`, `app.controller.ts`, and `app.service.ts`: The core application files defining the main module, controller, and service.
- `modules/`: The modular structure of the application:
   - `user/`: User management and authentication module.
   - `chat/`: Chat and messaging functionalities.
   - `game/`: Game logic and related services.

- `auth/`: Contains authentication logic and strategies.
- `common/`: Shared utilities and common functionalities across the application.
- `main.ts`: The entry point of the NestJS application.

## Test Directory

- `test/`: Contains end-to-end tests for the application.

## Configuration Files

- `nest-cli.json`: Configuration for the NestJS CLI, defining project settings.
- `tsconfig.json` and `tsconfig.build.json`: TypeScript compiler configuration files for the development and build processes.

## Additional Notes

- The backend is structured to facilitate ease of development and scalability.
- Developers should follow the established modular pattern when adding new features or services.
