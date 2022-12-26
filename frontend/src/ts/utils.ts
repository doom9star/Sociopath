export function isEmail(s: string): string | null {
  const regexp = /^([\w&.-]{1,64})@[\w&.-]{1,63}\.[\w.]{1,63}/;
  const result = s.match(regexp);
  return !result ? result : result[1];
}
export function cleanObject(o: Record<any, any>): object {
  const co = Object.assign({}, o);
  Object.keys(o).forEach((k) => {
    if (!co[k]) delete co[k];
  });
  return co;
}

export function getDate(d: string): string {
  const date = new Date(d);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
