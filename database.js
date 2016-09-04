var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");

let db = null;

module.exports = app => {
    if (!db) {
        const config = app.libs ? app.libs.config : app;
        const sequelize = new Sequelize(
            "sequelize",
            "sequelize",
            "sequelize",
            {
                dialect: "mssql",
                host: 'localhost',

                define: {
                    underscored: true
                }
            }
        );
        db = {
            sequelize,
            Sequelize,
            models: {}
        };
        const dir = path.join(__dirname, "models");

        fs.readdirSync(dir).forEach(file => {
            console.log("db models file => ", file)
            const modelDir = path.join(dir, file);
            const model = sequelize.import(modelDir);
            db.models[model.name] = model;
        });
        Object.keys(db.models).forEach(key => {
            db.models[key].associate(db.models);
        });
    }
    return db;
};