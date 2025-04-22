# 🧩 Microservices Node.js Project

> ⚠️ **IMPORTANT:** After creating a transaction, you must restart the `queue-service` to process it.  
> Run this command in your terminal:  
> **`docker compose restart queue-service`**


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


### 2. Start Services with Docker

docker-compose up --build
This will:

Start all services (transaction-service, queue-service, cron-service)

Start MongoDB and RabbitMQ containers



🔁 Complete API Flow (Step-by-Step)

    ✅ 1. Create Admin (One-Time Setup)
    API
    
    
    POST /auth/create
    # Payload
    json

    {
    "email": "admin@spark.com",
    "password": "admin123"
    }
    Service:
    auth-service → Stores admin in MongoDB

    ✅ 2. Admin Login
    API

    POST /auth/login
    # Payload
    json

    {
    "email": "admin@spark.com",
    "password": "admin123"
    }
    Returns a JWT token ✅
    → Use this token in all further requests:

    Authorization: Bearer <token>
    ✅ 3. Create User
    API

    POST /users
    # Payload

    {
    "name": "Kumar",
    "email": "kumar@spark.com",
    "mobile": "9876543210"
    }
    Service:
    user-service:

        - Auto-generates userId like SP10001

        - Creates user DB sparkup_SP10001

        - Initializes wallet with 0 balance

    ✅ 4. Assign Service Slabs to User
    API
    bash

    POST /service/assign
    # Payload
    json

    {
    "userId": "SP10001",
    "serviceId": "SV1001",
    "slabs": "50_1000_2.5_rupees/1001_5000_5_rupees"
    }
    Service:
    service-charge-service → Saves charge slabs for that user

    ✅ 5. Top-Up Wallet
    API

    POST /wallet/topup
    # Payload
    json

    {
    "userId": "SP10001",
    "amount": 1000
    }
    Service:
    wallet-service:

        - Connects to that user’s DB

        - Increases balance in wallet

    ✅ 6. Create Transaction
    API

    POST /transaction
    # Payload
    json

    {
    "userId": "SP10001",
    "amount": 1000,
    "serviceId": "SV1001"
    }
    Service:
    transaction-service:

        - Fetches service charge for the user

        - Creates a new transaction record

        - Publishes transaction data to transaction_queue in RabbitMQ

    ✅ 7. Process Transaction (Background)
    Worker:
    queue-service (RabbitMQ consumer)

    What Happens:
        Deducts amount + service charge + GST from user's wallet

        Sends transaction to Dummy Bank API

        Updates transaction status to "awaited"

    ✅ 8. Cron Service Updates to "success"
        Worker:
            cron-service (runs every minute using node-cron)

        What It Does:
            Finds transactions with status: "awaited"

            Updates them to status: "success"


    ✅ What Happens Behind the Scenes

    Step	Service	                Logic
    1	        auth-service	        Creates and logs in admin
    2	        user-service	        Auto-generates userId and DB
    3	        wallet-service	        Adds funds to user wallet DB
    4	        service-charge-service	Assigns dynamic slab-based charges
    5	        transaction-service	  Creates transaction, pushes to queue
    6	        queue-service	        Consumes queue, updates wallet, calls dummy bank API
    7	        cron-service	        Changes transaction from "awaited" to "success" periodically

    🔐 Secured Routes (Require Token)
        /users

        /wallet/topup

        /service/assign

        /transaction

        Get token from /auth/login and use it in headers:

        makefile

        Authorization: Bearer <token>


🐳 Docker Setup for Local Development
    📁 Project Structure

    microservices-project/
    ├── auth-service/
    │   ├── Dockerfile
    │   ├── .env
    ├── user-service/
    │   ├── Dockerfile
    │   ├── .env
    ├── wallet-service/
    ├── service-charge-service/
    ├── transaction-service/
    ├── queue-service/
    ├── cron-service/
    ├── dummy-bank-api/
    ├── api-gateway/
    ├── docker-compose.yml
    └── README.md


🛠 Dockerfile (for each service)

    - Each service has its own Dockerfile like this:


    # Dockerfile
    FROM node:18

    WORKDIR /app

    COPY . .

    RUN npm install

    EXPOSE 5001  # Change per service

    CMD ["npm", "start"]


🔗 docker-compose.yml (root level)

version: '3.8'
services:
  mongo:
    image: mongo
    container_name: mongo
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db

  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - '5672:5672'
      - '15672:15672'

  auth-service:
    build: ./auth-service
    ports:
      - '5001:5001'
    depends_on:
      - mongo

  user-service:
    build: ./user-service
    ports:
      - '5002:5002'
    depends_on:
      - mongo

  wallet-service:
    build: ./wallet-service
    ports:
      - '5003:5003'
    depends_on:
      - mongo

  service-charge-service:
    build: ./service-charge-service
    ports:
      - '5004:5004'
    depends_on:
      - mongo

  transaction-service:
    build: ./transaction-service
    ports:
      - '5005:5005'
    depends_on:
      - service-charge-service

  queue-service:
    build: ./queue-service
    depends_on:
      - rabbitmq
      - dummy-bank-api
      - mongo
    restart: always


  cron-service:
    build: ./cron-service
    depends_on:
      - mongo

  dummy-bank-api:
    build: ./dummy-bank-api
    ports:
      - '5008:5008'

  api-gateway:
    build: ./api-gateway
    ports:
      - '5000:5000'
    depends_on:
      - auth-service
      - user-service
      - wallet-service
      - service-charge-service
      - transaction-service

volumes:
  mongo_data:
