import { createRemoteJWKSet, jwtVerify, decodeJwt } from "jose";

const JWK_URI = process.env.JWK_URI;
if (!JWK_URI) throw new Error("JWK_URI is not set");

const JWKS = createRemoteJWKSet(new URL(JWK_URI));

export async function validateJWT(authHeader: string | undefined): Promise<boolean> {
  try {
    if (!authHeader?.startsWith("Bearer ")) return false;
    const token = authHeader.substring(7);
    await jwtVerify(token, JWKS);
    return true;
  } catch {
    return false;
  }
}

export function getEmailFromJWT(authHeader: string | undefined): string {
  try {
    if (!authHeader?.startsWith("Bearer ")) return "";
    const token = authHeader.substring(7);
    const payload = decodeJwt(token);
    if (typeof payload.email === "string") {
      console.log(payload.email)
      return payload.email;
    }
  } catch (err) {
    console.error("Error decoding JWT:", err);
  }

  return "";
}
