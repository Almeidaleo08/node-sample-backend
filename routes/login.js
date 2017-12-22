import jwt from "jwt-simple";
import moment from "moment";

module.exports = app => {

	const Users = app.db.models.Users;
	const UserCompany = app.db.models.UserCompany;
	const Company = app.db.models.Company;
	const cfg = app.libs.config;
	const beh = app.businesserrorhandler;

	app.post("/login", (req, res) => {

		var dataform = req.body;
		var expires = moment().add(cfg.expiration, cfg.expunit).valueOf();

		//validacao de dados de entrada
		req.assert('email', 'ERROR: email is required').notEmpty();
		req.assert('password', 'ERROR: password is required').notEmpty();

		//execucao da validação
		var error = req.validationErrors();
		if (error) {
			res.status(400).json(error);
		}
		else {
			const password = req.body.password;

			Users.findOne({ where: { email: req.body.email } })
				.then(user => {

					if (user) {
						if (user.status == "ACTIVE") {

							if (Users.isPassword(user.password, password)) {
								const payload = {
									user_id: user.id,
									email: user.email,
									exp: expires
								};

								res.json({
									token: jwt.encode(payload, cfg.jwtSecret),
									expiration: moment().add(cfg.expiration, cfg.expunit).format("DD-MM-YYYY HH:mm:ss")
								});

							}
							else {
								res.status(401).json({ msg: "Wrong password" });
							}
						}
						else {
							res.status(412).json({msg: "User not ACTIVE"});
						}
					}

					else {
						res.status(412).json({
							msg: "Username not found"});
					}
				}).catch(error => {
					res.status(412).json({ msg: error.message });
				});
		}
	})
}