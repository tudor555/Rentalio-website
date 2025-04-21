export class CookieUtil {
  static setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/`;
  }

  static getCookie(name: string): string {
    if (typeof document === 'undefined') return '';
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  }

  static deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }
}
