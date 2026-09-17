import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export const PASSWORD_REQUIREMENTS_MESSAGE =
  'Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre.';

export function isPasswordStrongEnough(password: string) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}
