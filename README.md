# Digital Wallet API

## Project Overview
The **Digital Wallet API** is a secure, modular, and role-based backend system for managing digital wallets, similar to popular platforms like Bkash or Nagad. The system allows users to register, manage wallets, and perform core financial operations such as adding money, withdrawing funds, and sending money to other users. Agents can facilitate cash-in/cash-out operations, while admins oversee the system and manage users, agents, and wallets.

The API is built with **Express.js** and **Mongoose**, following a modular architecture for scalability and maintainability.

---

## Features

### Authentication & Authorization
- JWT-based login system.
- Secure password hashing using **bcrypt**.
- Role-based access control for `user`, `agent`, and `admin`.
  
### User Features
- Wallet automatically created during registration with an initial balance (e.g., ৳50).
- Add money (top-up).
- Withdraw money.
- Send money to other users.
- View wallet balance and transaction history.

### Agent Features
- Add money to any user's wallet (cash-in).
- Withdraw money from any user's wallet (cash-out).
- View commission history (optional).

### Admin Features
- View all users, agents, wallets, and transactions.
- Block/unblock user wallets.
- Approve/suspend agents.
- Set system parameters (optional, e.g., transaction fees).

### Transaction Management
- All transactions are tracked and stored in the database.
- Transactions include type, amount, fee, initiator, status, and timestamps.
- Atomic balance updates to ensure data integrity.

### Validation & Business Rules
- Insufficient balance checks.
- Prevent transactions for blocked wallets.
- Validate receiver existence before sending money.
- Optional: Minimum balance enforcement.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT, bcrypt
- **Environment Management:** dotenv
- **Other Tools:** Postman for testing, Nodemon/ts-node-dev for development

---

## Project Structure


---

## API Endpoints

### Auth
| Method | Endpoint        | Description                       | Access       |
|--------|----------------|-----------------------------------|--------------|
| POST   | `/api/v1/user/register`| Register a new user/agent/admin   | Public       |
| POST   | `/api/v1/auth/login`   | Login and receive JWT              | Public       |

### Users
| Method | Endpoint                   | Description                     | Access |
|--------|----------------------------|---------------------------------|--------|
| PATCH  | `/api/v1/wallet/add-money`      | Add money to own wallet    | User   |
| PATCH  | `/api/v1/wallet/withdraw`       | Withdraw money from wallet | User   |
| POST   | `/api/v1/wallet/send-money`     | Send money to another user | User   |
| GET    | `/api/v1/wallet/transactions`   | Get own transaction history| User   |

### Agents
| Method | Endpoint                     | Description                       | Access  |
|--------|------------------------------|-----------------------------------|---------|
| post  | `/api/v1/wallet/cash-in`      | Add money to a user's wallet.user body {"recipientEmail":"ru@gmail.com","amount": 100}    | Agent   |
| post  | `/api/v1/wallet/cash-out`     | Withdraw money from a user's wallet {"recipientEmail":"ru@gmail.com", "amount": 100}  | Agent   |
| GET    | `/api/v1/wallet/commission-history`    | View agent commission history     | Agent   |

### Admin
| Method | Endpoint                       | Description                      | Access |
|--------|--------------------------------|----------------------------------|--------|
| GET    | `/api/v1/user/all-user`         | View all users                   | Admin  |
| GET    | `/admin/agents`                 | View all agents                  | Admin  |
| GET    | `/api/v1/wallet/`               | View all wallets                 | Admin  |
| GET    | `/api/v1/wallet/transactions`   | View all transactions            | Admin  |
| PATCH  | `/api/v1/user/:id`              | Block or unblock or update user  | Admin  |


---

## Setup & Environment




# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DB_URL= db_url

# JWT Authentication
JWT_ACCESS_SECRET=access_secret

JWT_ACCESS_EXPIRES=1h

JWT_REFRESH_SECRET=refresh_secret

JWT_REFRESH_EXPIRES=1d

# Password Hashing
BCRYPT_SALT_ROUNDS=10

# Admin Account (for initial login)
ADMIN_EMAIL=admin@gmail.com

ADMIN_PASSWORD=Admin@123
