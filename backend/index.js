import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;



app.use(cors({
    origin: ['https://trackmyfundss.netlify.app', 'http://localhost:5173'], 
  }));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true }));


app.use("/api-v1",routes)

// app.use("/", (req, res) => {
//     res.status(404).json({ 
//         status:"Not found yea ",
//         message: "Not Found", });
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});