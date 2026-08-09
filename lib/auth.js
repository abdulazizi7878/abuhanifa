import { VeriifyToken } from "./jwt";

export async function requireAdmin(req) {
  // ==========================================
  // GET TOKEN FROM REQUEST COOKIE
  // ==========================================

  const token = req.cookies?.token;

  // ==========================================
  // NO TOKEN
  // ==========================================

  if (!token) {
    return {
      authorized: false,
      status: 401,
      message: "Unauthorized",
    };
  }

  // ==========================================
  // VERIFY TOKEN
  // ==========================================

  let user;

  try {
    user = await VeriifyToken(token);
  } catch (error) {
    console.error("JWT verification failed:", error);

    return {
      authorized: false,
      status: 401,
      message: "Invalid or expired token",
    };
  }

  // ==========================================
  // CHECK ADMIN ROLE
  // ==========================================

  if (!user || user.role !== "admin") {
    return {
      authorized: false,
      status: 403,
      message: "Forbidden",
    };
  }

  // ==========================================
  // AUTHORIZED
  // ==========================================

  return {
    authorized: true,
    user,
  };
}