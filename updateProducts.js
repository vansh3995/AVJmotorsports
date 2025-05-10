
const firebase = require('firebase/app');
require('firebase/firestore');


const firebaseConfig = {
  apiKey: "AIzaSyC5GZSGq0-wJDvMmFyavk4eH3iOks8ge8k",
  authDomain: "andhe-chale-sawere-mein.firebaseapp.com",
  projectId: "andhe-chale-sawere-mein",

};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
db.collection('products').get().then(snapshot => {
  let updateCount = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.name) {
      console.log(`Updating ${doc.id}: ${data.name}`);
      db.collection('products').doc(doc.id).update({
        name_lowercase: data.name.toLowerCase()
      }).then(() => {
        updateCount++;
        if (updateCount === snapshot.size) {
          console.log('Update complete!');
          process.exit(0);
        }
      }).catch(err => {
        console.error(`Failed to update ${doc.id}:`, err);
      });
    } else {
      console.log(`Skipping ${doc.id}: no name field`);
    }
  });
  if (snapshot.size === 0) {
    console.log('No products found.');
    process.exit(0);
  }
});
