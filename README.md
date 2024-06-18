# Anime Scraper Frontend

## Description

Anime Scraper Frontend is a web application built with Next.js to display and manage anime data and download links.

## Requirements

- Node.js 14+
- npm or yarn
- Run the [Anime Scraper API](https://github.com/ElPitagoras14/scrap-anime-api).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ElPitagoras14/anime-scraper-frontend.git
   cd anime-scraper-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an `.env.local` file in the root of the project and add the following environment variables:

   ```env
   NEXT_PUBLIC_BACKEND_URL=
   NEXT_PUBLIC_IMAGE1_URL=
   NEXT_PUBLIC_IMAGE2_URL=
   ```

## Running the Development Server

1. Start the development server:

   ```bash
   npm run dev
   ```

The development server should be running at `http://localhost:3000`.

## Environment Variables

- `NEXT_PUBLIC_BACKEND_URL`: URL of the backend API.

- `NEXT_PUBLIC_IMAGE1_URL`: Hostname for loading remote images.

- `NEXT_PUBLIC_IMAGE2_URL`: Hostname for loading remote images.

## Author

- [Jonathan García](https://github.com/ElPitagoras14) - Computer Science Engineer
