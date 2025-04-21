# 🧩 Microservices Node.js Project

This project demonstrates a microservices-based architecture using *Node.js, **Express, **MongoDB, **RabbitMQ, and **Docker*. It includes:

- *Transaction Service* – Handles transaction creation and status.
- *Queue Service* – Consumes transactions, updates wallets, and triggers external APIs.
- *Cron Service* – Periodically updates transaction statuses.
- *RabbitMQ* – Message broker for communication between services.
- *MongoDB* – Stores user wallets and transactions.

---

## 📦 Services Structure

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Dhananjay5233/microservices-nodejs.git
cd microservices-nodejs

#### 2. Start Services with Docker

docker-compose up --build
This will:

Start all services (transaction-service, queue-service, cron-service)

Start MongoDB and RabbitMQ containers
