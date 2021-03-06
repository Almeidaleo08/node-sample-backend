//Connectionfactory Sequelize

import fs from "fs";
import path from "path";
import Sequelize from "sequelize";


let db = null;

module.exports = app => {
	if (!db) {
		const config = app.libs.config;
		var sequelize = new Sequelize(config.database, config.username, config.password, {
 										host: config.host,
  										dialect: config.dialect,
  										logging: config.logging

  									});

		db = {
			sequelize,
			Sequelize,
			models: {}
		};
		const dir = path.join(__dirname, "models");
		fs.readdirSync(dir).forEach(file => {
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