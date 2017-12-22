module.exports = {

	host: "",
	database: "",
	username: "",
	password: "",
	dialect: "",

	logging: false,

	
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

	
};