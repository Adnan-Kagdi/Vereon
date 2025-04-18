import AWS from "aws-sdk";

AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.ACCESS_KEY , // Avoid hardcoding in production!
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

const S3_BUCKET = "mygithubbuccket";

export { s3, S3_BUCKET }