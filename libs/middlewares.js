import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "./logger.js";
import helmet from "helmet";
import compression from "compression";
import expressValidator from "express-validator";
import multer from "multer";


module.exports = app => {

	const cfg = app.libs.config;


	app.set("port", 3000);

	app.enable('trust proxy');

	app.use(morgan("common", {
		stream: {
			write: (message) => {
				logger.info(message);
			}
		}
	}));


	//Middleware CORS, config de origem
	app.use(cors({
		origin: cfg.whiteList,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"]
	}));

	//Middleware de Segurança -- Content Security Policy, X-Powered-By, HTTP Public Key Pinning,
	//HTTP Strict Transport Security, X-Download-Options, client-side caching,sniffing, ClickJacking e XSS
	app.use(helmet());

	//compressao de payload -- GZIP
	app.use(compression());

	//Formatacao de espacos no JSON de retorno
	app.set("json spaces", 4);

	//BodyParser para retorno JSON
	app.use(bodyParser.json());

	//Validacao de dados API
	app.use(expressValidator());

	//Autenticacao por User Company
	app.use(app.auth.initialize());


	//Middleware de exclusão dos IDs no body da request
	app.use((req, res, next) => {
		delete req.body.id;
		next();
	});



	app.use(express.static("public"));
};