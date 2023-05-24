# Payload Node.js Library

A Node.js library for integrating [Payload](https://payload.co).

## Installation

## Install using npm

```bash
npm install payload-api
```

## Get Started

Once you've installed the Payload Node.js library to your environment,
import the `payload` module to get started.

**ESM**

```javascript
import payload from 'payload-api'
```
**CommonJS**

```javascript
const pl = require('payload-api')
```

**TypeScript**

_TypeScript declaration is in BETA._ TypeScript import is the same as the ES Module import.

```javascript
import payload from 'payload-api'
```

### API Authentication

To authenticate with the Payload API, you'll need a live or test API key. API
keys are accessible from within the Payload dashboard.

```javascript
import payload from 'payload-api'

const pl = payload.Session('secret_key_3bW9JMZtPVDOfFNzwRdfE')
```

### Creating an Object

Interfacing with the Payload API is done primarily through Payload Objects. Below is an example of
creating a customer using the `pl.Customer` object.

_Payload's Node.js API uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)._

```javascript
// Create a Customer
const cust = await pl.create(pl.Customer({
  email: 'matt.perez@example.com',
  name: 'Matt Perez',
}))
```

```javascript
// Create a Payment
const pmt = await pl.create(pl.Payment({
  amount: 100.0,
  payment_method: pl.Card({
    card_number: '4242 4242 4242 4242',
  })
}))
```

### Updating an Object

Updating an object is a simple call to the `update` object method.

```javascript
// Updating a customer's email
cust.update({ email: 'matt.perez@newwork.com' })
```

### Selecting Objects

Objects can be selected using any of their attributes using `filterBy`.

```javascript
// Select a customer by email
const results = pl.select(pl.Customer).filterBy({ email: 'matt.perez@example.com' })
```

Write complex queries using `filter`.

```javascript
const results = pl.session(pl.Payment).filter(
    pl.Payment.amount.gt(100),
    pl.Payment.amount.lt(200),
    pl.or(
        pl.Payment.description.contains("Test1"),
        pl.Payment.description.contains("Test2"),
    )
    pl.Payment.created_at.gt(new DateTime(2019,2,1))
)
```

## Documentation

To get further information on Payload's Node.js library and API capabilities,
visit the unabridged [Payload Documentation](https://docs.payload.co/?javascript).
