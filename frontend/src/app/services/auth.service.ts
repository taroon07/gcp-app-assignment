import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  /**
   * Login a user using email and password.
   * Returns the user's role as a string ('manager' or 'employee').
   */
  async login(email: string, password: string): Promise<string> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = credential.user.uid;

      const userSnap = await getDoc(doc(this.firestore, `users/${uid}`));
      if (!userSnap.exists()) throw new Error('no-role');

      const role = userSnap.data()['role'];
      if (!role) throw new Error('no-role');

      return role;
    } catch (err: any) {
      console.error('AuthService login error:', err);
      throw err;
    }
  }

  /**
   * Public method to fetch a user's email by their UID.
   * Throws an error if the UID does not exist.
   */
  async getUserEmailByUid(uid: string): Promise<string> {
    try {
      const userSnap = await getDoc(doc(this.firestore, `users/${uid}`));
      if (!userSnap.exists()) throw new Error(`User not found for UID: ${uid}`);
      const email = userSnap.data()['email'];
      if (!email) throw new Error(`Email not found for UID: ${uid}`);
      return email;
    } catch (err) {
      console.error(`AuthService getUserEmailByUid error:`, err);
      throw err;
    }
  }

  /**
   * Optional: Logout the current user.
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('userEmail');
    } catch (err) {
      console.error('AuthService logout error:', err);
    }
  }
}
