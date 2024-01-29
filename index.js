require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const profileRouter = require("./routes/profileRouter")

app.use(express.json())
app.use(cors())

// route
app.get('/', (req, res) => {
    res.status(200).send("BETA HOME SERVER")
})
app.use("/api/v1", profileRouter)
// error route
app.use((req,res)=> {
    res.status(404).send("RESOURCE NOT FOUND")
})


// db connection
const startServer = async () => {
    try {
        await mongoose.connect(process.env.mongo_url, {dbName: "betahome"});
        app.listen(PORT, ()=> {
            console.log(`server listening on ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();