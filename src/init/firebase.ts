import FirebaseAdminKey from '../../.firebase-admin-key.json';
import FirebaseAdmin from 'firebase-admin';

FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert({
    projectId: FirebaseAdminKey.project_id,
    clientEmail: FirebaseAdminKey.client_email,
    privateKey: FirebaseAdminKey.private_key,
  }),
});
