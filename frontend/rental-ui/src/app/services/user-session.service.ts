import { Injectable } from '@angular/core';

const USER_KEY = 'user';
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 1 day

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  static saveUser(user: any) {
    const sessionData = {
      value: user,
      expiry: Date.now() + ONE_DAY_IN_MS,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(sessionData));
  }

  static loadUser(): any | null {
    const dataStr = localStorage.getItem(USER_KEY);
    if (!dataStr) return null;

    try {
      const data = JSON.parse(dataStr);
      if (Date.now() > data.expiry) {
        this.clearUser();
        return null;
      }
      return data.value;
    } catch (error) {
      console.error('Failed to parse user session data', error);
      this.clearUser();
      return null;
    }
  }

  static clearUser() {
    localStorage.removeItem(USER_KEY);
  }

  static isLoggedIn(): boolean {
    return !!this.loadUser();
  }

  static isAdmin(): boolean {
    const user = this.loadUser();
    return user?.role === 'admin';
  }
}
