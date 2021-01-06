// set up an HTTP server to view the coverage report
const express = require('express')
const app = express()
const port = 3000

const path = require('path')

app.use('/', express.static(path.join(__dirname, '/coverage/lcov-report/')))

app.use((request, response, next) => {
  response.status(404).send('404 not found')
})

app.listen(port, (error) => {
  if (error) {return console.log(error)}
  console.log(`server is listening on port: ${port}`)
})
