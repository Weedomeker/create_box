require('dotenv').config();
const fs = require('fs');
const createBox = require('./src/create-box');
const isDev = require('isdev');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('./public'));
app.use(express.static('./client/dist'));

let data = [];
let fileName;

app.get('/', (req, res) => {
  //console.log(isDev ? 'isDev' : 'isProd')
  res.sendFile(path.join(__dirname, './client/dist/'));
});

app.post('/', (req, res) => {
  data = [];
  data.push(req.body);
  console.log('Center= ', data[0].center);
  createBox(
    parseFloat(data[0].width),
    parseFloat(data[0].long),
    parseFloat(data[0].height),
    parseFloat(data[0].tickness),
    parseFloat(data[0].smallsides),
    parseFloat(data[0].bottomside),
    parseFloat(data[0].arround),
    parseFloat(data[0].center),
  );
  res.sendStatus(200);
});

app.get('/download', async (req, res) => {
  let fileDownload = '';

  const files = fs.readdirSync('./public/temp/');
  files.forEach((file) => {
    if (path.extname(file) == '.dxf') fileDownload = file;
    console.log('✔️', file);
  });

  res.download('./public/temp/' + fileDownload, (err) => {
    if (err) {
      console.log('Download error: ', err);
      res.redirect('/');
    }

    for (const file of files) {
      fs.unlink(path.join(__dirname, `./public/temp/${file}`), (err) => {
        if (err) throw err;
      });
    }
  });
});

app.get('/api', (req, res) => {
  res.send(data[0]);
});

app.listen(PORT, () => {
  console.log(`Server start on port: ${PORT}`);
});
