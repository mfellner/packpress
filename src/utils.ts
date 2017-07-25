export const sep = (() => {
  if (typeof process !== 'undefined' && process.platform === 'win32') {
    return '\\';
  }
  return '/';
})();

export const isBrowser = 'browser' in process;

export function basename(s: string, ext: string = ''): string {
  const i = s.lastIndexOf(sep) + 1;
  return s.substring(i, s.lastIndexOf(ext));
}

export function extname(s: string): string {
  const i = s.lastIndexOf('.');
  return i !== -1 ? s.substring(i) : '';
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map(p => {
      if (p.endsWith(sep)) {
        return p.substring(0, p.length - 1);
      }
      if (p.startsWith(sep)) {
        return p.substring(1);
      }
      return p;
    })
    .join(sep);
}
