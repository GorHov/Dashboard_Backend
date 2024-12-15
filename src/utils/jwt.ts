import jwt from 'jsonwebtoken';

export const generateJwt = (id: number, email: string) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }
  );
};
