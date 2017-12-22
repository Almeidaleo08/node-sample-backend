//Inicializacao da aplicacao - sequelize aplicando automaticamente mudancas no BD
//utilizacao do modulo HTTPS

import fs from "fs";

module.exports = app => {
	if (process.env.NODE_ENV !== "test") {

		//app.db.sequelize.sync().done(() => {
		app.listen(app.get("port"), () => {
			console.log("Environment - " + process.env.NODE_ENV);
			console.log("==================================");
			console.log(`Working APIs - porta ${app.get("port")}`);
		});
		//});
	}
};