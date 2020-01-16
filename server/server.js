const express = require("express");
const app = express();
const port = 3000;
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
});

app.get("/api", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`API Server started on port ${port}!`));

// class Part extends Model {}
// Part.init({
//     // attributes
//     FBXfile: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     name: {
//         type: Sequelize.STRING
//     }
// }, {
//     sequelize,
//     modelName: 'part'
// });