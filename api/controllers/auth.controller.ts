import { Request } from "express";
import * as jwt from "jsonwebtoken";

const jwtSecretKey = process.env?.JWT_SECRET_KEY as string;
function getUserIdFromJwtToken(req: Request, token?: string): string | number {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const _token = authHeader.replace("Bearer ", "");
      if (_token) {
        const _userId = getJwtTokenPaylod(_token) as jwt.JwtPayload;
        return _userId.userId as number;
      } else {
        return "No token found";
      }
    }
  } else if (token) {
    const _userId = getJwtTokenPaylod(token) as string;
    return _userId as unknown as number;
  }

  return "Authentication failed!!";
}

function getJwtTokenPaylod(token: string) {
  return jwt.verify(token, jwtSecretKey);
}

export { getUserIdFromJwtToken };
