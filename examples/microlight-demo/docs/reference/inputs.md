# Input fields supported by Microlight
- string
- number
- date
- file
- dropdown


###  Date
```js
inputs:{
  date:{
    name: "Date",
    description: "in YYYYMMDD format",
    // default: new Date(Date.now() - 86400000).toISOString().substring(0,10),
    default: '2025-01-08',
    placeholder:'date to process this',
    type: 'date',
    required: true
  },
  // ... other inputs
}
```


###  String
```js
inputs:{
  name:{
    name: "Name",
    description: "Name of the person",
    // default: new Date(Date.now() - 86400000).toISOString().substring(0,10),
    default: 'World',
    placeholder:'Your name',
    type: 'string',
    required: false
  },
  // ... other inputs
}
```
