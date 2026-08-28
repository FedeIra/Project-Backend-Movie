const emailjs = require('@emailjs/nodejs');

exports.handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;

  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  );
  const fileName = key.split('/').pop();

  const templateParams = {
    bucketName: bucket,
    keyName: fileName,
  };

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};
