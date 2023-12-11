require('dotenv').config()
const isDev = require('isdev')
const path = require('path')
const express = require('express')
const cors = require('cors')
const isdev = require('isdev')
const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const data = []

app.get('/', (req, res) => {
  console.log(isDev ? 'isDev' : 'isProd')
  res.sendFile(path.join(__dirname, './client/'))
})

app.get('/api', (req, res) => {
  res.json({test: 'test'})
})

app.post('/', (req, res) => {
  data.push(req.body)
  console.log(data)
})

app.listen(PORT, () => {
  console.log(`Server start on port: ${PORT}`)
})