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
