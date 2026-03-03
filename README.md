# DataPulse API – Real-Time Data Analytics Platform

A high-performance REST API and analytics dashboard for ingesting, processing, and visualizing large-scale data streams in real time.

🔗 **Live Demo:** [sercod.com/demos/datapulse-api](https://sercod.com/demos/datapulse-api/)

## Features

- 📡 **Real-Time Ingestion** – WebSocket-based data streaming with sub-second latency
- 📊 **Analytics Dashboard** – Interactive charts and metrics visualization
- 🔌 **REST API** – Clean, documented endpoints for data push and query
- 🔑 **API Key Auth** – Secure access control per client
- 📁 **Multi-Source Support** – Connect CSV, JSON, webhooks, or custom integrations
- ⚡ **Fast Queries** – Optimized aggregation with Redis caching

## Tech Stack

- **Backend:** Python (FastAPI) + PostgreSQL + Redis
- **Frontend:** React + TypeScript + Recharts
- **Auth:** API Key + JWT
- **Infra:** Docker, async workers

## API Usage

```bash
# Ingest data
curl -X POST https://your-api/ingest \
  -H "X-API-Key: your_key" \
  -d '{"metric": "cpu_usage", "value": 72.4}'

# Query metrics
curl https://your-api/metrics?from=2024-01-01&to=2024-01-31 \
  -H "X-API-Key: your_key"
```

## Getting Started

```bash
git clone https://github.com/sercancosar7/datapulse-api.git
cd datapulse-api
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

## License

MIT
