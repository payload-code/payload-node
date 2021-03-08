# Payload Node.js Library

A Node.js library for integrating [Payload](https://payload.co).

## Installation

## Install using npm

```bash
npm install payload-api
```

## Get Started

Once you've installed the Payload Node.js library to your environment,
import the `payload` module to get started. **Note:** We recommend
using the shorthand name of `pl` when importing.

**CommonJS**

```javascript
var pl = require('payload-api');
```

**ESM**

```javascript
import pl from 'payload-api';
```

**TypeScript**

*TypeScript declaration is in BETA.* TypeScript import is the same as the ES Module import.

```javascript
import pl from 'payload-api';
```

### API Authentication

To authenticate with the Payload API, you'll need a live or test API key. API
keys are accessible from within the Payload dashboard.

```javascript
var pl = require('payload-api');
pl.api_key = 'secret_key_3bW9JMZtPVDOfFNzwRdfE'
```

### Creating an Object

Interfacing with the Payload API is done primarily through Payload Objects. Below is an example of
creating a customer using the `pl.Customer` object.

*Payload's Node.js API uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).*


```javascript
// Create a Customer
pl.Customer.create({
    email: 'matt.perez@example.com',
    name: 'Matt Perez'
}).then(function(customer) {});
```


```javascript
// Create a Payment
pl.Payment.create({
    amount: 100.0,
    payment_method: new pl.Card({
        card_number: '4242 4242 4242 4242'
    })
}).then(function(payment) {
})
```

### Accessing Object Attributes

Object attributes are accessible through both dot and bracket notation.

```python
customer.name
customer['email']
```

### Updating an Object

Updating an object is a simple call to the `update` object method.

```javascript
// Updating a customer's email
customer.update({ email: "matt.perez@newwork.com" })
```

### Selecting Objects

Objects can be selected using any of their attributes.

```javascript
// Select a customer by email
pl.Customer
    .filter_by({ email: 'matt.perez@example.com' })
    .then(function(customers){})
```

Use the `pl.attr` attribute helper
interface to write powerful queries with a little extra syntax sugar.

```python
pl.Payment.filter_by(
    pl.attr.amount.gt(100),
    pl.attr.amount.lt(200),
    pl.attr.description.contains("Test"),
    pl.attr.created_at.gt(new DateTime(2019,2,1))
).then(function(payments){});
```

## Documentation

To get further information on Payload's Node.js library and API capabilities,
visit the unabridged [Payload Documentation](https://docs.payload.co/?javascript).

