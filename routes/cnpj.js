import moment from "moment";
import request from 'request';


module.exports = app => {

    app.route("/v1/cnpj/:cnpj")
        .all(app.auth.authenticate())
        .get((req, res) => {
            var options = {
                uri: 'https://www.receitaws.com.br/v1/cnpj/' + req.params.cnpj,
                port: 80,
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                },
                json: true,
                timeout:5000
            };
            request(options, function (error, response, message) {
                if (!error && response.statusCode == 200) {
                    res.json(message);
                }
                else {
                    res.json(error);
                }
            })
        });
}