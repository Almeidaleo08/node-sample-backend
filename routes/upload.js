import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import moment from "moment";


var filename = "";
var bucketname = "";


module.exports = app => {

    const Documents = app.db.models.Documents;

    const cfg = app.libs.config;
    const beh = app.businesserrorhandler;

    aws.config.update({
        accessKeyId: cfg.awsAccessKey,
        secretAccessKey: cfg.awsAccessSecret,
        region: 'us-east-1'
    });

    const s3 = new aws.S3({ /* ... */ });

    let time = moment.utc().format("DD-MM-YYYY HH:mm:ss SS");

    var upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: function (req, file, cb) {
                bucketname = cfg.uploadBucket + req.params.bucketType;
                cb(null, bucketname);
            },
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                filename = req.user.id + "/" + file.originalname + ".?" + time;
                cb(null, filename);
            }
        }),
        limits: {
            fileSize: 9000000
        }
    },
    );

    app.route('/upload/:uploadname')
        .all(app.auth.authenticate())

        .post(upload.array('attachment', 1), function (req, res, next) {

            var paramHead = {
                Bucket: bucketname,
                Key: filename
            }


            switch (req.params.companyType.toUpperCase()) {
                case "SELLER":
                    req.body.sellerGovernmentId = req.params.governmentId;
                    break;
                case "BUYER":
                    req.body.buyerGovernmentId = req.params.governmentId;
                    break;
                case "SPONSOR":
                    req.body.sponsorGovernmentId = req.params.governmentId;
            }

            s3.getSignedUrl('getObject', paramHead, function (err, url) {
                res.json({
                    msg: "Contract uploaded",
                    url: url.substring(0, url.indexOf("?"))
                })
                    .catch(error => {
                        res.status(412).json({ msg: error.message });
                    });
            });
        });

}