const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.validateMasterPassword = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === 'OPTIONS') {
      res.status(200).send();
      return;
    }

    const { password } = req.body;

    if (!password) {
      res.status(400).json({ error: 'Password is required' });
      return;
    }

    try {
      // Fetch master password from Firestore
      const db = admin.firestore();
      const configDoc = await db.collection('config').doc('masterPassword').get();

      if (!configDoc.exists) {
        res.status(404).json({ error: 'Master password not configured' });
        return;
      }

      const masterPassword = configDoc.data().password;
      const isValid = password === masterPassword;

      res.status(200).json({ isValid });
    } catch (error) {
      console.error('Error validating password:', error);
      res.status(500).json({ error: 'Error validating password' });
    }
  });
});
