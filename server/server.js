const express = require("express");
const app = express();
const port = 3000;
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

class Part extends Model {}
Part.init({
    // attributes
    FBXfile: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING
    }
}, {
    sequelize,
    modelName: 'part'
});