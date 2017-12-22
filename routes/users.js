import moment from "moment";
import jwt from "jwt-simple";

module.exports = app => {

  const Users = app.db.models.Users;
  const UserCompany = app.db.models.UserCompany;
  const Company = app.db.models.Company;
  const cfg = app.libs.config;
  const beh = app.businesserrorhandler;


  app.route("/user")
    .all(app.auth.authenticate())


    /**
    * @api {get} /user Exibe usuário autenticado
    * @apiGroup Usuario
    * @apiHeader {String} Authorization Token de usuário
    * @apiHeaderExample {json} Header
    * {"Authorization": "JWT xyz.abc.123.hgf"} 
    * @apiSuccess {Number} id Id de registro
    * @apiSuccess {String} name Nome
    * @apiSuccess {String} email Email
    * @apiSuccessExample {json} Sucesso
    * HTTP/1.1 200 OK
    * {
    * "id": 1,
    * "name": "John Connor",
    * "email": "teste@teste.com"
    * }
    * @apiErrorExample {json} Erro de consulta
    * HTTP/1.1 412 Precondition Failed
    */

    .get((req, res) => {

      Users.findOne({ where: { id: req.user.id }, attributes: ["id", "name", "email"] })
        .then(result => {
          res.json(result);
        })
        .catch(error => {
          res.status(412).json({ msg: error.message });
        });

    })

    .put((req, res) => {
      req.body.lastUserIp = req.ip;

      if (req.body.email || req.body.password) {
        res.status(400).json({ msg: "key user data cannot be change from this API" });
      }
      else {
        Users.update(req.body, { where: { id: req.user.id } })
          .then(user => {
            Users.findOne({ where: { id: req.user.id }, attributes: ["id", "name", "email"] })
              .then(result => {
                res.json(result);
              })
          })
          .catch(error => {
            res.status(412).json({ msg: error.message });
          });
      }

    });


  // Essa rota não precisa de autenticação - - Inclusao de User
  app.post("/users", (req, res) => {

    var dataform = req.body;

    //validacao de dados de entrada
    req.assert('name', 'ERROR: name is required').notEmpty();
    req.assert('email', 'ERROR: email is required').notEmpty();
    req.assert('password', 'ERROR: password is required').notEmpty();
    req.assert('phone', 'ERROR: phone is required').notEmpty();

    req.body.status = "INACTIVE";


    //execucao da validação
    var error = req.validationErrors();
    if (error) {
      res.status(400).json(error);
    }
    else {

      Users.findOne({ where: { email: req.body.email } })
        .then(result => {
          if (!result) {

            Users.create(req.body)
              .then(result => {
                var expires = moment().add(60, "minutes").valueOf();
                const payload = {
                  user_id: result.id,
                  email: result.email,
                  exp: expires,
                  type: "USER"
                };
                res.status(200).json({
                  id: result.id, email: result.email, status: result.status,
                  token: jwt.encode(payload, cfg.jwtSecret),
                  expiration: moment().add(15, "minutes").format("DD-MM-YYYY HH:mm:ss")
                });
              })

          }
          else {
            /*res.status(400).json({
              businessErrorId: "1",
              message: "email already in use for Users"
            });*/
            res.status(412).json({Msg: "USER ALREADY REGISTERED" });
          }
        })
        .catch(error => {
          res.status(412).json({ msg: error.message });
        });
    }
  });



  
  app.route("/password")
    .all(app.auth.authenticate())

    .post((req, res) => {

      var dataform = req.body;

      //validacao de dados de entrada
      req.assert('newPassword', 'ERROR: newPassword is required').notEmpty();

      //execucao da validação
      var error = req.validationErrors();
      if (error) {
        res.status(400).json(error);
      }
      else {
        Users.update({
          password: req.body.newPassword,
        },
          { where: { id: req.user.id }, individualHooks: true })
        Users.findOne({
          where: { id: req.user.id }, attributes: [
            "id", "name", "email", "phone", "createdAt", 'updatedAt']
        })
          .then(result => {
            res.json(result);
          })
          .catch(error => {
            res.status(412).json({ msg: error.message });
          });
      }
    })


    .put((req, res) => {

      var dataform = req.body;

      req.body.lastUserIp = req.ip;

      //validacao de dados de entrada
      req.assert('oldPassword', 'ERROR: oldPassword is required').notEmpty();
      req.assert('newPassword', 'ERROR: newPassword is required').notEmpty();

      //execucao da validação
      var error = req.validationErrors();
      if (error) {
        res.status(400).json(error);
      }
      else {

        Users.findOne({ where: { id: req.user.id } })
          .then(user => {

            if (user) {
              if (user.status == "ACTIVE") {

                if (Users.isPassword(user.password, req.body.oldPassword)) {

                  Users.update({
                    password: req.body.newPassword,
                    lastUserIp: req.body.lastUserIp
                  },
                    { where: { id: req.user.id }, individualHooks: true })
                    .then(userupd => {
                      Users.findOne({
                        where: { id: req.user.id }, attributes: [
                          "id", "name", "email", "phone","createdAt", 'updatedAt']
                      })
                        .then(result => {
                          res.json(result);
                        })
                    });
                }
                else {
                  res.status(401).json({ msg: "Wrong password" });
                }
              }
              else {
                res.status(401).json({ msg: "User not ACTIVE" });
              }
            }
          })
          .catch(error => {
            res.status(412).json({ msg: error.message });
          });

      }
    });



  app.post("/useractivation", (req, res) => {

    var dataform = req.body;

    //validacao de dados de entrada
    req.assert('email', 'ERROR: email is required').notEmpty();

    //execucao da validação
    var error = req.validationErrors();
    if (error) {
      res.status(400).json(error);
    }
    else {
      Users.findOne({ where: { email: req.body.email } })
        .then(user => {

          if (user) {
            if (user.status == "INACTIVE") {
              var expires = moment().add(15, "minutes").valueOf();
              const payload = {
                user_id: user.id,
                email: user.email,
                exp: expires,
              };
              res.status(200).json({
                id: user.id, email: user.email, status: user.status,
                token: jwt.encode(payload, cfg.jwtSecret),
                expiration: moment().add(15, "minutes")
                  .format("DD-MM-YYYY HH:mm:ss")
              });
            }
            else {
              //res.status(401).json({ msg: "User already ACTIVE" });
              res.status(412).json({
                msg: 
                  "User already active"
              });
            }
          }
          else {
            res.status(401).json({ msg: "Username not found" });
          }
        });
    }
  });




  app.post("/forgotpassword", (req, res) => {

    var dataform = req.body;

    //validacao de dados de entrada
    req.assert('email', 'ERROR: email is required').notEmpty();

    //execucao da validação
    var error = req.validationErrors();
    if (error) {
      res.status(400).json(error);
    }
    else {
      Users.findOne({ where: { email: req.body.email } })
        .then(user => {

          if (user) {
            if (user.status == "ACTIVE") {
              var expires = moment().add(15, "minutes").valueOf();
              const payload = {
                user_id: user.id,
                email: user.email,
                exp: expires,
              };
              res.status(200).json({
                id: user.id, email: user.email, status: user.status,
                token: jwt.encode(payload, cfg.jwtSecret),
                expiration: moment().add(15, "minutes")
                  .format("DD-MM-YYYY HH:mm:ss")
              });
            }
            else {
              res.status(401).json({ msg: "User not ACTIVE" });
            }
          }
          else {
            res.status(401).json({ msg: "Username not found" });
          }
        });
    }
  });


};


