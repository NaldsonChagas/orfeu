# Orfeu

Orfeu is a music discovery platform that helps you explore albums and artists using data from Last.fm. It consists of a NestJS API backend and a React frontend, both running seamlessly with Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

## Environment Variables

Create a `.env` file inside both `orfeu-api` and `orfeu-web` directories. You can copy the provided `.env.example` files:

### API (`orfeu-api/.env`)

| Variable | Description | Default |
|---|---|---|
| `LASTFM_API_KEY` | Your Last.fm API key (required) | – |
| `LASTFM_BASE_URL` | Last.fm API base URL | `https://ws.audioscrobbler.com/2.0/` |

### Web (`orfeu-web/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | URL of the API service | `http://localhost:3000` |

## Running with Docker Compose

```bash
docker compose up
```

This starts both the API (port 3000) and the web app (port 5173). The web app is accessible at [http://localhost:5173](http://localhost:5173).

To rebuild images after changes:

```bash
docker compose up --build
```

To run in the background:

```bash
docker compose up -d
```

To stop the services:

```bash
docker compose down
```