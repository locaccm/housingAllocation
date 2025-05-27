# Housing Allocation MicroService

# LocaCCM

MicroService manages adding, updating, deleting and getting all leases 

## Features

- Create a lease (`POST /lease`)
- Update an existing lease (`PUT /lease/:id`)
- Delete a lease (`DELETE /lease/:id`)
- Use Swagger (`/lease-docs`)
- Unit testing with Jest & Supertest
- Code quality via ESLint, Prettier & SonarCloud

## Tech Stack

- Node.js / Express
- TypeScript
- Prisma
- PostgreSQL
- Swagger
- Jest & Supertest

## MicroService Structure

```plaintext
src/
├── controllers/ 
├── routes/
├── services/ 
├── swagger.ts 
├── server.ts 
├── tests/
    ├── controllers/ 
    ├── services/
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/locaccm/housingAllocation.git
cd housingAllocation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the database following the .env.example

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/db
```
    
### 4. Set up the database with Prisma
```bash
npx prisma migrate deploy
```

### 5. Start server
```bash
npm run dev
```
Go to http://localhost:5000

## Swagger API Documentation
The Swagger UI is automatically generated from JSDoc annotations.

Access it at: http://localhost:5000/lease-docs

## Run tests
```bash
npm test
```

## API Endpoints

| Method | Endpoint       | Description                |
|--------|----------------|----------------------------|
| POST   | /lease         | Create a new lease         |
| PUT    | /lease/:id     | Update a lease             |
| DELETE | /lease/:id     | Delete a lease             |


## Author

Clément Foulon 

DevOps and owner of Housing Allocation MicroService