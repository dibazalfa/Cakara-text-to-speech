import express from "express";
import cors from "cors";
import router from "./controller.js";
import DOMPurify from 'dompurify'

const app = express();
const port = 3000;

app.use(cors());

app.use((req, res, next) => { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//home
// app.get('/plaintext/:url', async (req, res) => {
//   const url = req.params.url;
//   try {
//     const response = await axios.get(url);
//     const sanitizedHTML = DOMPurify.sanitize(response.data, { KEEP_FORMATTING: true });
//     const tagRegex = /<\/?[a-z][^>]*>/gi;
//     const tags = sanitizedHTML.match(tagRegex);
//     let plaintext = sanitizedHTML;

//     tags.forEach(tag => {
//       plaintext = plaintext.replace(tag, `\n${tag}\n`)
//     })

//     res.send(sanitizedHTML);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Terjadi kesalahan saat mengambil data dari URL tersebut');
//   }
// });


//about
app.get('/plaintext/:url', async (req, res) => {
  const url = req.params.url;
  try {
    const response = await axios.get(url);
    const sanitizedHTML = DOMPurify.sanitize(response.data);
    res.send(sanitizedHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat mengambil data dari URL tersebut');
  }
});