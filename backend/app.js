const express = require('express')
const cors = require('cors')
const db = require('./db/db')
const { readdirSync } = require('fs')
const path = require('path')
const app = express()
require('dotenv').config()

const PORT = process.env.PORT

// middlewares
app.use(express.json())
app.use(cors())


// routes
readdirSync('./routes')
   .filter(file => file.endsWith('.js'))
   .map((route) => {
      const routePath = path.join(__dirname, './routes/', route);
      const routeModule = require(routePath);

      if (typeof routeModule === 'function') {
         app.use('/api/v1', routeModule);
      } else {
         console.error(`Invalid middleware in file ${routePath}`);
      }
   });

const server = () => {
    db()
    app.listen(PORT, function(err) {
      if (err) console.log(err);
      console.log('listening to port:', PORT)
    })
}

server()