# Hacker News — Editorial Crawler 📰

A high-performance web crawler and analytical dashboard designed to extract and process data from Hacker News. This solution features a robust TypeScript backend with a layered architecture and a distinctive "Modern Brutalist" editorial frontend.

> [!NOTE]
> This project was developed as a technical challenge, prioritizing clean code, automated testing, and professional deployment patterns.

## ✨ Key Features

- **Automated Scraping**: Extract the first 30 entries from Hacker News in milliseconds.
- **Smart Filtering**:
  - Titles with > 5 words, ordered by comment count.
  - Titles with ≤ 5 words, ordered by points.
- **Advanced Word Counting**: Precise logic that excludes symbols and considers only spaced words.
- **Performance Analytics**: Real-time execution time tracking and persistence of all usage data.
- **Premium UI**: Staggered layout animations and high-end typography (Instrument Serif & JetBrains Mono).

## 🏗️ Architecture

The system is built as a decoupled Full-Stack application:

```text
┌─────────────────┐      ┌─────────────────────────┐      ┌──────────────────┐
│  React SPA      │ ────▶│  Express API (Node.js)  │ ────▶│  Hacker News     │
│  (Framer Motion)│      │  (Layered Architecture) │      │  (HTML Scraping) │
└─────────────────┘      └───────────┬─────────────┘      └──────────────────┘
                                     │
                                     ▼
                         ┌─────────────────────────┐
                         │  SQLite (Usage Logs)    │
                         └─────────────────────────┘
```

### Backend Patterns
- **Layered Architecture**: Controllers, Services, and Repositories.
- **Security**: Hardened with `helmet` and `compression`.
- **Logging**: Structured, production-grade logs with `pino`.
- **Error Handling**: Centralized global error middleware.

## 🚀 Quick Start

### Using Docker (Recommended)
The easiest way to run the full stack is using Docker Compose:

```bash
docker-compose up --build
```
- **Frontend**: http://localhost
- **API**: http://localhost:3001

### Local Development
**1. Backend setup:**
```bash
cd backend
npm install --legacy-peer-deps
npm run dev
```

**2. Frontend setup:**
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

Automated unit tests cover the core business logic, including word counting and sorting algorithms.

```bash
cd backend
npm run test
```

> [!IMPORTANT]
> The word counting logic strictly follows the challenge requirement: `"This is - a self-explained example"` is counted as 5 words.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Framer Motion, Lucide.
- **Backend**: Node.js, Express, TypeScript, Cheerio (Fast Scraping), SQLite.
- **Infrastructure**: Docker, Docker Compose.

