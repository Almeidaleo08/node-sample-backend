import cluster from "cluster";
import os from "os";
import logger from "./libs/logger.js";


const CPUS = os.cpus();

if (cluster.isMaster) {
	CPUS.forEach(() => cluster.fork());
	cluster.on("listening", worker => {
		console.log("Cluster %d conectado", worker.process.pid);
		logger.info("Cluster %d conectado", worker.process.pid);
	});
	cluster.on("disconnect", worker => {
		console.log("Cluster %d desconectado", worker.process.pid);
		logger.info("Cluster %d conectado",  worker.process.pid);
	});
	cluster.on("exit", worker => {
		console.log("Cluster %d saiu do ar", worker.process.pid);
		logger.info("Cluster %d conectado",  worker.process.pid);
		cluster.fork();
		// Garante que um novo cluster inicie se um antigo morrer
	});
	} else {
	require("./index.js");
}