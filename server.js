require('dotenv').config();
const fs = require('fs');
const createBox = require('./src/create-box');
const isDev = require('isdev');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, './public/temp')));
app.use(express.static(path.join(__dirname, './client/dist')));

let data = [];
let fileName;

app.get('/', async (req, res) => {
  if (await fs.existsSync(path.join(__dirname, `./client/dist`))) {
    res.sendFile(path.join(__dirname, './client/dist'));
  } else {
    res.sendStatus(200);
  }
});

app.post('/', async (req, res) => {
  if (await fs.existsSync(path.join(__dirname, `./public/temp/`))) {
    const files = await fs.readdirSync(path.join(__dirname, './public/temp/'));
    for (const file of files) {
      await fs.unlink(path.join(__dirname, `./public/temp/${file}`), (err) => {
        if (err) throw err;
      });
    }
  }
  data = [];
  data.push(req.body);
  await createBox(
    parseFloat(data[0].width),
    parseFloat(data[0].long),
    parseFloat(data[0].height),
    parseFloat(data[0].tickness),
    parseFloat(data[0].smallsides),
    parseFloat(data[0].bottomside),
    parseFloat(data[0].arround),
    parseFloat(data[0].center),
  );
  if (
    await fs.existsSync(
      path.join(
        __dirname,
        `./public/temp/${data[0].width}x${data[0].long}x${data[0].height}cm${
          data[0].center == 1.5 ? '_center' : ''
        }.svg`,
      ),
    )
  ) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get('/create_box/download/dxf', async (req, res) => {
  let fileDownload = '';

  const files = fs.readdirSync(path.join(__dirname, './public/temp/'));
  files.forEach((file) => {
    if (path.extname(file) == '.dxf') fileDownload = file;
    console.log('✔️ ', file);
  });

  res.download('./public/temp/' + fileDownload, (err) => {
    if (err) {
      console.log('Download error: ', err);
      res.redirect('/');
    }
  });
});

app.get('/create_box/download/svg', async (req, res) => {
  let fileDownload = '';

  const files = fs.readdirSync(path.join(__dirname, './public/temp/'));
  files.forEach((file) => {
    if (path.extname(file) == '.svg') fileDownload = file;
    console.log('✔️ ', file);
  });

  res.download('./public/temp/' + fileDownload, (err) => {
    if (err) {
      console.log('Download error: ', err);

      res.redirect('/');
    }
  });
});

app.get('/api', (req, res) => {
  res.send(data[0]);
});

app.listen(PORT, () => {
  console.log(`Server start on port: ${PORT}`);
});
