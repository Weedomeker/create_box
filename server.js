require('dotenv').config()
const createBox = require('./src/create-box')
const isDev = require('isdev')
const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let data = []

app.get('/', (req, res) => {
  console.log(isDev ? 'isDev' : 'isProd')
  res.sendFile(path.join(__dirname, './client/'))
})

app.post('/', (req, res) => {
  data = []
  data.push(req.body)
  console.log(data[0])
  createBox(parseFloat(data[0].width), parseFloat(data[0].long), parseFloat(data[0].height), parseFloat(data[0].tickness), parseFloat(data[0].smallsides))
  res.sendStatus(200)
})

app.get('/api', (req, res) => {
  res.send(data[0])
})

app.listen(PORT, () => {
  console.log(`Server start on port: ${PORT}`)
})