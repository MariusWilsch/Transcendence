
# Frontend Structure Documentation

## Overview
This document provides an overview of the frontend structure for the `ft_transcendence_project`. The frontend is built using React with Vite and TypeScript, following best practices for maintainability and scalability.

## Main Files and Directories

- `README.md`: A guide to the frontend application, including setup and usage instructions.
- `index.html`: The entry point HTML file for the React application.
- `package.json` and `package-lock.json`: These files manage project dependencies and ensure consistent installations across setups.
- `public/`: Contains static assets like images, icons, etc., accessible to the public.

## Source Directory (`src/`)

- `App.css` and `App.tsx`: The main styling file and the root React component of the application.
- `assets/`: Houses static assets such as images used within the application.
- `components/`: Includes UI components structured according to Atomic Design principles:
  - `atoms/`: Smallest building blocks of the UI (e.g., buttons, input fields).
  - `molecules/`: Groups of atoms functioning together (e.g., search bar).
  - `organisms/`: Complex UI sections composed of molecules and/or atoms (e.g., navigation menu).
- `pages/`: Components representing different pages of the application (e.g., Home, About).
- `services/`: Contains logic for API calls and other business-related functionalities.
- `styles/`: Global stylesheets and specific CSS for the application.
- `utils/`: Utility functions and helpers that provide common functionalities across the application.
- `vite-env.d.ts`: TypeScript declaration file for Vite-specific environment variables.

## Configuration Files

- `tsconfig.json` and `tsconfig.node.json`: Configuration files for TypeScript, defining compiler options and other settings.
- `vite.config.ts`: The configuration file for Vite, specifying build and development settings for the frontend.

## Additional Notes

- The structure is designed to promote easy navigation and modification.
- Developers are encouraged to follow the established patterns for consistency and efficiency.
