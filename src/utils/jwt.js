import jwt from 'jsonwebtoken';

export function signToken(payload, secret, expiresIN="7d"){
  return jwt.sign(payload,secret,{expiresIn});
};

export function verifyToken(token,secret){
  return jwt.verify(token,secret);
};

