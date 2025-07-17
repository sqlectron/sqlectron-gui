export function RegexString(name: string): RegExp {
  return new RegExp(name.replace(/[^a-z0-9]/gi, ''), 'i');
}
