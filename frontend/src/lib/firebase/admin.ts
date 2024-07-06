import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = require('serviceAccountKey.json');

export const firebaseAdmin = getApps()[0] ??
  initializeApp({
    credential: cert(serviceAccount),
  });

export const auth = getAuth();
