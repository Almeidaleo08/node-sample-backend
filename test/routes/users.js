describe("Routes: users", () => {
  const Users = app.db.models.Users;

  var user_id = 0;

      describe("POST /users", () => {
        
                    before(done => {
                        Users.destroy({where:{}})
                                    .then(user => {                
                                        done();
                                    });
                    });


                    describe("status 200", () => {
                    it("returns user created", done => {
                        request.post("/users")
                        .send({
                                name: "TEST_USER",
                                email: "test_user@test.test",
                                phone:"+55 11 999999999",
                                password: "1111",
                                passNumber: "1234"
                        })
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body).to.include.keys("id");
                            done(err);
                        });
                    });
                    });

                    describe("status 400", () => {
                            it("throws error missing arguments", done => {
                            request.post("/users")
                                .send({
                                        name: "TEST_USER",
                                        phone:"+55 11 999999999",
                                        password: "1111",
                                        passNumber: "1234"
                                        })
                                .expect(400)
                                .end((err, res) => {
                                done(err);
                                });
                            });

                        it("throws error when registering email for a existing email", done => {
                            request.post("/users")
                                .send({
                                        name: "TEST_USER",
                                        email: "test_user@test.test",
                                        phone:"+55 11 999999999",
                                        password: "1111",
                                        passNumber: "1234"
                                })
                                .expect(400)
                                .end((err, res) => {
                                done(err);
                                });
                            });
                    });

        });

  });