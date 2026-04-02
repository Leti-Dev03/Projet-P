import crypto from 'crypto';

/**
 * Hash un token JWT avec SHA-256
 * SHA-256 n'a pas de limite de longueur contrairement à bcrypt (72 chars max)
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Compare un token avec son hash SHA-256
 */
export const compareToken = (token, hashedToken) => {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return hash === hashedToken;
};