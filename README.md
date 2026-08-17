# TravelBharat — Explore India, State by State

A centralized tourism information platform for discovering Indian states, cities,
and tourist destinations — heritage sites, natural attractions, adventure spots,
and cultural landmarks — through a structured, modern interface.

> 🚧 Work in progress — built module by module as part of a Unified Mentor
> internship project. This README will be filled out as features land.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcrypt

## Project Structure

```
TravelBharat/
├── client/     React frontend
├── server/     Express REST API
└── docs/       Project documentation
```

## Running Locally

### Server

```bash
cd server
npm install
npm run dev
```

Requires a `server/.env` file — copy `server/.env.example` and fill in your
own values (MongoDB Atlas URI, JWT secret, etc.).

### Client

```bash
cd client
npm install
npm run dev
```

Requires a `client/.env` file — copy `client/.env.example` and set the API URL.

## Status

Currently: **Phase 1 — project scaffolding**. Feature modules (auth, states,
cities, destinations, search, admin dashboard) are being built incrementally.
