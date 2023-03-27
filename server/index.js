import express from "express";
import cors from "cors";
import router from "./controller.js";
import DOMPurify from 'dompurify'

const app = express();
const port = 3000;

app.use(cors({
  // origin: '/plaintext/:url',
  // methods: ["GET", "POST"]
}));

// app.use (function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173") //mengatur domain yang diizinkan
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next();
// });

app.use("/", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.get('/plaintext/:url', async (req, res) => {
  const url = req.params.url;
  try {
    const response = await axios.get(url);
    const sanitizedHTML = DOMPurify.sanitize(response.data);
    res.send(sanitizedHTML);
    // res.set('Access-Control-Allow-Origin', '*');
    res.send(response.data)
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat mengambil data dari URL tersebut');
  }
});