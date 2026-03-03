# DataPulse API – Real-Time Data Analytics Platform

High-performance RESTful API with real-time data processing, caching, and comprehensive documentation.

🔗 **Live Demo:** [sercod.com/demos/datapulse-api](https://sercod.com/demos/datapulse-api/)

## Features

- 📡 **Real-Time Processing** – WebSocket-based data streaming with sub-second latency
- ⚡ **Caching Layer** – Redis-powered caching for high-performance queries
- 📚 **API Documentation** – Full Swagger/OpenAPI interactive docs
- 🔑 **API Key Auth** – Secure per-client access control
- 🗄️ **Flexible Storage** – MongoDB for time-series and unstructured data
- 📊 **Analytics Endpoints** – Aggregation, filtering, and reporting out of the box

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** MongoDB
- **Cache:** Redis
- **Docs:** Swagger / OpenAPI
- **Auth:** API Key + JWT

## API Usage

```bash
# Ingest data
curl -X POST https://your-api/ingest \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"metric": "cpu_usage", "value": 72.4}'

# Query metrics
curl https://your-api/metrics?from=2024-01-01&to=2024-01-31 \
  -H "X-API-Key: your_key"
```

## Getting Started

```bash
git clone https://github.com/sercancosar7/datapulse-api.git
cd datapulse-api
npm install
cp .env.example .env
npm run dev
```

## License

MIT – see [LICENSE](./LICENSE)
