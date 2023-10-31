import express from "express";
import viewEngine from "./config/viewEngine";
import initWedRoute from "./route/wed";
import connectDB from "./config/conectDB";
import cors from 'cors';

let app = express();


app.use(express.urlencoded({ limit: '50mb' }, { extended: true }));
app.use(express.json({ limit: '50mb' }));


app.use(cors({ credentials: true, origin: true }));

require('dotenv').config();
const port = process.env.PORT || 2002;
//Port === undef => port = 2002





//config app
viewEngine(app);//config viewEngine
initWedRoute(app);//config route
//connect database
connectDB(app);


app.listen(port, (req, res) => {
    console.log(`Back_end Nodejs is running... http://localhost:${port}`
    )
})
