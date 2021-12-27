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
  console.log(`Web server started: You can view the coverage report being served as a web page if running on a local computer at http://localhost:${port} or on repl.it refresh the web view browser.`)
})