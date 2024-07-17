import * as jose from "jose";

const alg = "HS256";
const secret = new TextEncoder().encode(process.env.SALT!);

type JwtPayload = {
  userId: string;
};

async function jwtSign(payload: JwtPayload) {
  const jwt = new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setExpirationTime("2h");
  return jwt.sign(secret);
}

async function jwtVerify(jwt: string) {
  const { payload } = await jose.jwtVerify<JwtPayload>(jwt, secret);
  return payload;
}

export { jwtSign, jwtVerify };
