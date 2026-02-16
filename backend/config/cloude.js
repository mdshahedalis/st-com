const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');

const awsbucketregion =process.env.AWS_BUCKET_REGION 
const awsaccesskeyid = process.env.AWS_ACCESS_KEY_ID 
const awssecretaccesskey = process.env.AWS_SECRET_ACCESS_KEY
const awsbucketname = process.env.AWS_BUCKET_NAME


const s3Client = new S3Client({
  region: awsbucketregion,
  credentials: {
    accessKeyId: awsaccesskeyid,
    secretAccessKey: awssecretaccesskey,
  },
});

// Use memory storage (only for small files)
const s3Upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // Max 5GB (S3 PUT limit)
});

const uploadToS3 = async (fileBuffer, fileName, mimeType) => {

  const cleanFileName = fileName.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
              
  const params = {
    Bucket: awsbucketname,
    Key: cleanFileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${awsbucketname}.s3.${awsbucketregion}.amazonaws.com/${cleanFileName}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Could not upload file to S3');
  }
};

module.exports = { s3Upload, s3Client, uploadToS3 };