const express = require('express')
const bodyParser = require('body-parser')
const {Pool} = require('pg')

// Express setup
const app = express()
const port = 3000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// DB setup
const db = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'bookshelf_dev',
  user: 'admin',
  password: 'admin',
})

// Can take a callback to invoke or returns a Promise
function fakeFetch(data, cb) {
  if (typeof cb === 'function') {
    return cb(data)
  } else {
    return new Promise((resolve, reject) => { 
      resolve(data)
    })
  }
}

// --------------------------------------------------------------------------
// Using standard callbacks...
function dbGetUsersCallbacks(req, res, next) {
  console.log('dbGetUsersCallbacks()')
  db.query('SELECT * FROM users ORDER BY id ASC', (error, dbResponse) => {
    if (error) { 
      next(error) // pass error to Express to deal with
    } else {
      fakeFetch(dbResponse.rows, fetchResponse => {
        res.status(200).send(fetchResponse)
      })
    }
  })
}

// Using Promises...
function dbGetUsersPromises(req, res, next) {
  console.log('dbGetUsersPromises()')
  db.query('SELECT * FROM users ORDER BY id ASC')
  .then(dbResponse => {
    return fakeFetch(dbResponse.rows) // async... I dunno how long this will take
  })
  .then(fetchResponse => {
    res.status(200).send(fetchResponse)
  })
  .catch((error) => {
    next(error)
  })
}

// Async/Await
async function dbGetUsersAsync(req, res, next) {
  console.log('dbGetUsersAsync()')
  try {
    let dbResponse = await db.query('SELECT * FROM users ORDER BY id ASC')
    let fetchResponse = await fakeFetch(dbResponse.rows)
    res.status(200).send(fetchResponse)
  } catch (error) {
    next(error)
  }
}
// --------------------------------------------------------------------------

// Route to get all users
app.get('/users', (req, res, next) => {
  // Only uncomment one of these
  dbGetUsersCallbacks(req, res, next)
  // dbGetUsersPromises(req, res, next)
  // dbGetUsersAsync(req, res, next)
})

app.listen(port, () => {
  console.log(`Express server started on port ${port}.`)
})


