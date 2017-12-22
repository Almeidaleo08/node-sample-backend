describe("Routes: Upload", () => {
	describe("POST /upload", () => {
            it('Upload session', function(done) {
                request.post('/upload/teste')
                    .attach('attachment', './test/files/teste.txt')

                    .end(function(err, res) {
                    //    expect(res.status).to.equal(201);
                        done(err);
                    })
            });
	});
});