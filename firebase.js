const config = require("./config.json");
const firebase = require("firebase");
require("firebase/firestore");

// Initialize Firebase
const app = firebase.initializeApp(config.firebase_config);
// firebase.analytics();

const db = firebase.firestore();

const storeMessage = (msg) => {
  const initialRef = db.collection(`servers`);
  const serverRef = initialRef.doc(`${msg.server.id}_${msg.server.name}`);
  serverRef.set({
    name: msg.server.name,
    id: msg.server.id,
  });
  const channel = serverRef.collection(`channels`);
  const channelRef = channel.doc(`${msg.channel.id}_${msg.channel.name}`);
  channelRef.set({
    name: msg.channel.name,
    id: msg.channel.id,
    last_message: firebase.firestore.FieldValue.serverTimestamp(),
  });
  const message = channelRef.collection(`messages`);
  const messageRef = message.doc(`${msg.msgID}_${msg.author.name}`);
  messageRef.set({
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    ...msg,
  });
};

const storeUser = async (sender, server) => {
  const initialRef = db.collection("users");
  const userRef = await initialRef.doc(`${sender.id}`);
  const snapshot = await userRef.get();
  const exists = await snapshot.exists;
  if (!exists) {
    userRef.set({
      ...sender,
      server: server,
      pp: Math.ceil(Math.random() * 10 + 1),
    });
  }
};

const findPP = async (sender) => {
  const initialRef = db.collection("users");
  const userRef = await initialRef.doc(`${sender}`);
  const snapshot = await userRef.get();
  if (snapshot.exists) return snapshot.data().pp;
  else return "pp not found";
};
module.exports = { storeMessage, storeUser, findPP };
