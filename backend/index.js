import express from 'express'
import dotenv from 'dotenv'
import connectDB from "./config/database.js"
// import morgan from 'morgan';
const app = express();
dotenv.config();
const PORT = process.env.PORT;
// app.use(morgan("dev"));
app.get('/', (req, res) => {
  res.send('Hello World');
});
connectDB();
app.listen(PORT, () => {
  console.log(`Backend app listening on port: http://localhost:${PORT}`)
});