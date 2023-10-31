import express from "express";


//config viewEngine
let conFigViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("viewengine", "ejs");
    app.set("views", "./src/views");
}

module.exports = conFigViewEngine;