const admin = require("firebase-admin");
const fcm = require("fcm-notification");
// import fcm from "fcm-notification";

let FCM;
let fcmValid = false;

const setFirebase = async () => {
  if (fcmValid) {
    console.log("Step -1");
    return FCM;
  } else {
    console.log("Step 0");

    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    serviceAccount.private_key = serviceAccount.private_key
      .split(String.raw`\n`)
      .join("\n");

    const certPath = await admin.credential.cert(serviceAccount);

    FCM = await new fcm(certPath);

    fcmValid = true;

    return FCM;
  }
};

export { setFirebase, FCM };
