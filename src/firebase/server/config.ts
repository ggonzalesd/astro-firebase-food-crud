import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const { credential } = admin;

// Check if there is no app running
if (admin.apps.length < 1)
  initializeApp({
    credential: credential.cert({
      projectId: import.meta.env.SECRET_SERVER_FIREBASE_PROJECT_ID,
      clientEmail: import.meta.env.SECRET_SERVER_FIREBASE_CLIENT_EMAIL,
      privateKey: import.meta.env.SECRET_SERVER_FIREBASE_PRIVATE_KEY,
    }),
  });

export const serverAuth = getAuth();
export const serverFirestore = getFirestore();
