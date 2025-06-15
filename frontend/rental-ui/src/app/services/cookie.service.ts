export class CookieUtil {
  static getCookie(name: string): string {
    if (typeof document === 'undefined') return '';
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  }

  static deleteCookie(name: string) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }
}
