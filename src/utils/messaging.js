const { messaging } = require("firebase-admin");
const { initializeApp, cert } = require("firebase-admin/app");
const path = require("path");
const fs = require("fs");
const { CONFIG } = require("../config/config");

const credentialsPath = path.join(__dirname, CONFIG.GOOGLE_APPLICATION_CREDENTIALS);
const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

console.log(`Firebase credentials path: ${credentialsPath}`);
console.log(`Firebase credentials: ${JSON.stringify(serviceAccount)}`); 


initializeApp({
    credential: cert(serviceAccount),
    projectId: "salary-e7357",
});

async function sendNotification(data) {
    const message = {
        token: data.token,
        notification: {
            title: data.title,
            body: data.body,
            imageUrl: data.imageUrl,
        },
        data: data.payload,
    };
    try {
        await messaging().send(message);
        return true
    } catch(e) {
        return false;
    }
}

module.exports = {
    sendNotification,
};


