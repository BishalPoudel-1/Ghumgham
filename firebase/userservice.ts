import { auth, database } from 'firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { signOut } from 'firebase/auth';

const sanitizeEmail = (email: string): string => email.replace(/\./g, '_');



export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const user = auth.currentUser;
    if (user && user.email) {
      const emailKey = sanitizeEmail(user.email);
      const userRef = ref(database, `users/${emailKey}`);
      
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          resolve(data);
        } else {
          reject('User data not found');
        }
      }, (error) => {
        reject(error);
      });
    } else {
      reject('No user logged in');
    }
  });
};

export const logoutUser = () => {
  return signOut(auth);
};
