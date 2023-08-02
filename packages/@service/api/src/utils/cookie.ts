export function parseCookieHeader(
  authHeader: string | null
): Map<string, string> | undefined {
  const cookieList = authHeader?.split('; ');
  const cookieMap = cookieList?.reduce((acc, cur) => {
    const [key, val] = cur.split('=');
    acc.set(key, val);
    return acc;
  }, new Map<string, string>());
  return cookieMap;
}
