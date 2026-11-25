export const sessionCookie = {
  path: "/",
  httpOnly: true,
  sameSite:
    process.env.NODE_ENV === "production" || process.env.RENDER === "true"
      ? "none"
      : "lax",
  secure:
    process.env.NODE_ENV === "production" || process.env.RENDER === "true",
};

export function validPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    Buffer.byteLength(password, "utf8") <= 72
  );
}

export function currentSession(decoded, user) {
  return (decoded.tokenVersion ?? 0) === (user.tokenVersion ?? 0);
}
