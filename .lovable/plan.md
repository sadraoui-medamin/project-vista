

## ProjectFlow Microservices Architecture Document

Generate a comprehensive PDF document covering the full microservices architecture, database schemas, and API design for ProjectFlow.

### Output
- **File**: `/mnt/documents/projectflow_architecture.pdf` (multi-page PDF)
- **Tool**: Python + ReportLab for PDF generation

### Document Pages

1. **Cover Page** — Title, date, version
2. **System Overview** — High-level diagram of all 7 services, API Gateway, message queues, databases
3. **API Gateway** — Node.js/Express/TS, rate limiting (token bucket), JWT validation, route table
4. **Auth Service** — Node.js/PostgreSQL/Redis, DB schema (`users`, `sessions`, `refresh_tokens`), bcrypt + Passport flow
5. **Project & Task Service** — Fastify/PostgreSQL/Elasticsearch, DB schema (`projects`, `tasks`, `sprints`, `epics`, `task_history`), Product Backlog model with story points and acceptance criteria
6. **Real-Time Service** — Socket.io/Redis Pub/Sub, room architecture, event types
7. **Notification Service** — Node.js/RabbitMQ/MongoDB, queue processing, email channels (SendGrid/SES)
8. **File Storage Service** — Node.js/S3/MinIO/PostgreSQL, Sharp processing, pre-signed URL flow
9. **Analytics Service** — Python/FastAPI/ClickHouse, materialized views, Plotly endpoints
10. **Inter-Service Communication** — REST via Gateway + async RabbitMQ events
11. **Infrastructure** — Docker/K8s deployment, CI/CD, health checks
12. **Entity Relationship Diagrams** — Combined PostgreSQL ERD + MongoDB document structures

### Technical Approach
- Use ReportLab to programmatically generate formatted tables, architecture diagrams with boxes/arrows, and color-coded sections per service
- QA every page by converting to images before delivery

