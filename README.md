# Task Manager — Full-Stack Application

A full-stack task management application with user authentication, task CRUD operations, due dates, priority levels, and a dashboard with task statistics.

## Architecture

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security |
| Frontend | React 18, TypeScript, React Router 6 |
| Database | AWS DynamoDB (enhanced client) |
| Auth | JWT (jjwt 0.12) |
| API Docs | OpenAPI 3.0 / Swagger UI (springdoc) |
| Infra | Terraform (EKS, VPC, DynamoDB), Kubernetes |
| Containers | Docker, Docker Compose |

## Project Structure

```
├── backend/                  # Spring Boot Java backend
│   ├── src/main/java/com/taskmanager/
│   │   ├── config/           # DynamoDB, CORS, OpenAPI config
│   │   ├── controller/       # REST controllers
│   │   ├── dto/              # Request/Response DTOs
│   │   ├── model/            # DynamoDB entity models
│   │   ├── repository/       # Data access layer
│   │   ├── security/         # JWT auth filter, token provider
│   │   └── service/          # Business logic
│   └── src/test/             # Unit & integration tests
├── frontend/                 # React 18 TypeScript frontend
│   └── src/
│       ├── components/       # Navbar, TaskCard, TaskForm
│       ├── pages/            # Login, Register, Dashboard, Tasks
│       ├── services/         # Axios API client
│       ├── context/          # Auth context provider
│       └── types/            # TypeScript type definitions
├── terraform/                # AWS infrastructure (EKS, VPC, DynamoDB)
├── kubernetes/               # K8s deployment manifests
├── api-contracts/            # OpenAPI 3.0 specification
└── docker-compose.yml        # Local development stack
```

## Quick Start

### Prerequisites
- Java 17+, Maven 3.6+
- Node.js 18+, npm
- Docker & Docker Compose (for local DynamoDB)

### Run with Docker Compose
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- DynamoDB Local: http://localhost:8000

### Run Locally

**Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/tasks` | Yes | List user's tasks |
| POST | `/api/tasks` | Yes | Create task |
| GET | `/api/tasks/{id}` | Yes | Get task by ID |
| PUT | `/api/tasks/{id}` | Yes | Update task |
| DELETE | `/api/tasks/{id}` | Yes | Delete task |
| GET | `/api/tasks/dashboard/stats` | Yes | Dashboard statistics |

## Tests

```bash
cd backend
mvn test    # 18 tests: JWT, TaskService, AuthController
```

## Infrastructure

### Terraform (AWS)
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Provisions: VPC, subnets, EKS cluster, DynamoDB tables.

### Kubernetes
```bash
kubectl apply -f kubernetes/
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AWS_REGION` | `us-east-1` | AWS region |
| `DYNAMODB_ENDPOINT` | _(empty)_ | Local DynamoDB endpoint |
| `DYNAMODB_TABLE_PREFIX` | `taskmanager` | Table name prefix |
| `JWT_SECRET` | _(base64 key)_ | JWT signing key |
| `JWT_EXPIRATION_MS` | `86400000` | Token TTL (24h) |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins |
