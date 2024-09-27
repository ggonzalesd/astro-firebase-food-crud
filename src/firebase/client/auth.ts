import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { firebaseAuth } from './config';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider);

    const { displayName, email, photoURL, uid } = result.user;
    const token = await result.user.getIdToken();

    return {
      ok: true,
      body: {
        uid,
        token,
        display: displayName,
        email,
        src: photoURL,
      },
    };
  } catch (e) {
    const error = e as { message: string; code: string };

    return {
      ok: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }
};

export const registerWithEmailAndPassword = async (
  email: string,
  password: string,
  displayName: string,
) => {
  try {
    const response = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    const { uid, photoURL } = response.user;
    const token = await response.user.getIdToken();

    if (!!firebaseAuth.currentUser)
      await updateProfile(firebaseAuth.currentUser, { displayName });

    return {
      ok: true,
      body: {
        uid,
        token,
        display: displayName,
        email,
        src: photoURL,
      },
    };
  } catch (e) {
    const error = e as { message: string; code: string };

    return {
      ok: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  try {
    const response = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    const { uid, photoURL, displayName } = response.user;
    const token = await response.user.getIdToken();

    return {
      ok: true,
      body: {
        uid,
        token,
        display: displayName,
        email,
        src: photoURL,
      },
    };
  } catch (e) {
    const error = e as { message: string; code: string };

    return {
      ok: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }
};

export const logoutFirebase = async () => {
  return await firebaseAuth.signOut();
};
