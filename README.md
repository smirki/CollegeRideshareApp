<img src="https://github.com/smirki/Ugo/blob/dev/frontend/assets/ugoicon.png" alt="Ugo Logo" width="200"/> 

Ugo - College Rideshare App
===========================

Introduction
------------

Welcome to Ugo, the ultimate college rideshare solution! Ugo offers a dynamic platform designed for college students to share rides, host events, and purchase tickets. Our innovative mapping service ensures you get to your destination efficiently.

Features
--------

-   Driving: Share a ride or find a ride to campus, events, and more.
-   Event Hosting: Create and manage events within the college community.
-   Ticketing Service: Easy buying and selling of tickets for campus events.
-   Mapping Service: Navigate campus and beyond with Ugo's bespoke maps.

Development
-----------

Ugo's development workflow is centered around the `dev` branch, which serves as the staging area for all new features and bug fixes.

### Getting Started

-   Clone the repository and create a new branch off `dev` for each feature or bug fix.
-   Use GitHub issues to track tasks. Create a branch for each issue you're working on directly from the issue page.

### Branching and Pull Requests

-   Always branch off `dev`.
-   After completing your work, submit a pull request to `dev`.
-   Pull requests to `main` are reserved for releases and require team review.

### Environment Setup

-   Ask a project maintainer for the `.env` file to connect to MongoDB.
-   Ensure Docker is installed and running for API services.

Technology Stack
----------------

-   Frontend: Developed with React Native for a seamless mobile experience.
-   Backend: Flask API manages database interactions and core functionality.
-   Real-Time Services: `node_websockets` handles real-time driver ride requests.
-   Containerization: Custom APIs are containerized with Docker for consistency across environments.

## Development Setup
To set up your development environment, follow these steps:

1. **Install Required Software:**
   - Install [Insomnia](https://insomnia.rest/download), [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation), [React Native CLI](https://reactnative.dev/docs/environment-setup), and [Docker Desktop](https://www.docker.com/products/docker-desktop).

2. **Environment Configuration:**
   - Create a `.env` file in the `frontend` folder based on the `.env.example`.
   - Acquire a `.env` file for the `backend/flask_api` to connect to the MongoDB server.
   - Get a `cloudflared` JSON file from a project maintainer and place it in the `.cloudflared` directory.
   - Run the batch scripts in `.cloudflared` to set up your Cloudflare tunnel using your name and tunnel ID.

3. **Running Instructions:**
   - In the root project directory (`/ugo/`), run `docker-compose up --build` to start all microservices.
   - In the `.cloudflared/` directory, run `cloudflared tunnel run` to start the Cloudflare tunnel.
   - In the `frontend/` directory, run `npx expo start -c` to start the Expo server for the React Native app.

## Running Locally

1. **Docker Setup:**
   - Ensure Docker Desktop is running.
   - In the project root, run `docker-compose up --build` to start the Dockerized microservices.

2. **Cloudflared Tunnel:**
   - Navigate to your `.cloudflared` directory.
   - Run the user setup batch file: `user_setup.bat`.
   - Start the tunnel: `cloudflared --config config.yml tunnel run`.

3. **React Native App:**
   - In the `frontend/` directory, start the Expo server: `npx expo start -c`.

Make sure to configure the `.env` file in your `frontend` directory with the necessary variables.


Contributing
------------

We welcome contributions from fellow students and enthusiasts. Please read our contribution guidelines on submitting pull requests to us.

Thank you for being a part of Ugo, where every journey counts!
