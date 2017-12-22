//Direcionando para o ambiente de acordo com a variavel de ambiente NODE_ENV

module.exports = app => {
	const env = process.env.NODE_ENV;
	if (env) {
		return require(`./config.${env}.js`);
	}
	return require("./config.development.js");
};