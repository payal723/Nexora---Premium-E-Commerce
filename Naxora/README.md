# Dockerized MERN Ecommerce

A full-stack ecommerce application built using the MERN stack and containerized with Docker.

## Tech Stack

- React
- Node.js
- Express
- MongoDB Atlas
- Docker
- Vite

## Project Structure
ecommerce
│
├── backend
│ ├── models
│ ├── routes
│ ├── controllers
│ ├── server.js
│ └── Dockerfile
│
├── frontend
│ ├── src
│ ├── public
│ ├── vite.config.js
│ └── Dockerfile
│
├── docker-compose.yml
└── README.md

## Features

- User Registration
- User Login (JWT Authentication)
- Product listing
- Cart functionality
- MongoDB database integration
- Dockerized development environment

## Environment Variables

Create a `.env` file in the backend folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


## Run the Project with Docker

Make sure Docker is installed.

```

docker compose up --build


Frontend will run on:

http://localhost:5173

Backend API:

http://localhost:5000

Future Improvements

Product CRUD for admin

Order management

Payment integration

Image uploads

Deployment to cloud

Author

Payal