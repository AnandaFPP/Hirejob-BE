const express = require('express')
require('dotenv').config()
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const createError = require('http-errors')
const mainRouter = require('./src/routes/index')
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
// const multer = require('multer')
// const upload = multer()
const port = 8000

app.use(express.json());
app.use(morgan('dev'))
app.use(cors())
app.use(helmet());
app.use(xss())
app.use(bodyParser.json());
// app.use(upload.array())
app.use('/', mainRouter);
app.use('/img', express.static('src/upload'))
app.all('*', (req, res, next) => {
  next(new createError.NotFound())
})

app.post("/worker/login", (req, res) => {
  const { token } = req.body;

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
  });

  res.send("Login successful!");
});


app.use((err,req,res,next)=>{
  const messageError = err.message || "internal server error"
  const statusCode = err.status || 500

  res.status(statusCode).json({
    message : messageError
  })

})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

