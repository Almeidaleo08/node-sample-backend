describe("Routes: Login", () => {
  const Users = app.db.models.Users;

  describe("POST /login", () => {
    before(function() {
      Users
        .create({
            name: "Tester",
            email: "test@test.com",
            password: "12345",
            passnumber1: "1",
            passnumber2: "1", 
            passnumber3: "1", 
            passnumber4: "1", 
            phone: "+9999999999999"
        })
    });

    after(function() {
        Users.destroy({where: {email:"test@test.com"}});
    });

    describe("status 200", () => {
      it("returns authenticated user company", done => {
        request.post("/login")
          .send({
            email: "test@test.com",
            password: "12345"
          })
          .expect(200)
          .end((err, res) => {            
            expect(res.body).to.include.keys("token");
            done(err);
          });
      });
    });

    describe("status 400 and 401", () => {
      it("throws error when password is incorrect", done => {
        request.post("/login")
          .send({
            email: "test@test.com",
            password: "WRONG"
          })
          .expect(401)
          .end((err, res) => {            
            done(err);
          });
      });
      
      it("throws error when username is incorrect", done => {
        request.post("/login")
          .send({
            email: "wrong@test.com",
            password: "WRONG"
          })
          .expect(401)
          .end((err, res) => {            
            done(err);
          });
      });
    });
  });
});