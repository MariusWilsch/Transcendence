
# Docker Compose Configuration Documentation

## Overview
This document details the `docker-compose.yml` configuration for the `ft_transcendence_project`. Docker Compose is used to define and run multi-container Docker applications, encompassing the frontend, backend, and database services.

## Docker Compose Services

### Frontend Service
- **Build Context**: `./frontend` - Docker build context set to the frontend directory.
- **Ports**: Maps port `3000` of the container to port `3000` on the host.
- **Volumes**:
  - Maps the frontend directory to `/app` in the container for live code reloading.
  - Excludes `node_modules` to avoid conflicts between host and container environments.
- **Environment**: Sets `NODE_ENV` to development.
- **Depends On**: Ensures that the backend service starts before the frontend.

### Backend Service
- **Build Context**: `./backend` - Docker build context set to the backend directory.
- **Ports**: Maps port `5000` of the container to port `5000` on the host.
- **Volumes**:
  - Maps the backend directory to `/app` in the container.
  - Excludes `node_modules` similar to the frontend.
- **Environment**: Sets `NODE_ENV` to development.
- **Depends On**: Configured to start after the database service is up.

### Database (PostgreSQL) Service
- **Image**: Uses the official `postgres` image.
- **Ports**: Exposes port `5432`, the default for PostgreSQL.
- **Environment**:
  - `POSTGRES_DB`: Name of the database.
  - `POSTGRES_USER`: Database user.
  - `POSTGRES_PASSWORD`: Database password.
- **Volumes**: 
  - Uses `pgdata` volume to persist database data.

## Volumes

- `pgdata`: A named volume to ensure data persistence for the PostgreSQL database.

## Additional Notes

- This configuration is intended for development environments. For production, security, and networking settings might need adjustments.
- Sensitive information like database passwords should be managed securely, especially in production environments.
