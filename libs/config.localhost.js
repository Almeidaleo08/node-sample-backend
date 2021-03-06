import logger from "./logger.js";


module.exports = {
	host: "",
	database: "",
	username: "",
	password: "",
	dialect: "mysql",


	logging: (sql) => {logger.info(`[${new Date()}] ${sql}`);},

	//Chave secreta para autenticacao - token
	jwtSecret: "testeteste",
	jwtSession: {session: false},
	//colocar quantidade para expiracao do token
	expiration: 12,
	//colocar unidade de tempo para expiracao do token
	expunit: "hours",


	//Access key AWS
	awsAccessKey: "",
	awsAccessSecret: "",

	whiteList:['http://localhost:3000']


};