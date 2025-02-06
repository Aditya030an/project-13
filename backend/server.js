require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Routes
app.use('/tasks', require('./routes/taskRoutes.js'));

app.get("/" , (req , res)=>{
    res.send("Api working");
})
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server running on port' , port));
