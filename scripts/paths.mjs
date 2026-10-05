import { fileURLToPath } from 'node:url';
import { resolve, relative, isAbsolute, sep } from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
export function generatedPath(name) {
  const target = resolve(root, name);
  const local = relative(root, target);
  if (
    !local ||
    local === '..' ||
    local.startsWith('..' + sep) ||
    isAbsolute(local)
  ) {
    throw new Error('Generated path must stay inside the repository');
  }
  return target;
}
