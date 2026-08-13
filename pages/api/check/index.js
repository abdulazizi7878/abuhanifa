import { requireAdmin } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const auth = await requireAdmin(req);
  
  if (!auth.authorized) {
    return res.status(auth.status).json({ authorized: false, message: auth.message });
  }

  return res.status(200).json({ authorized: true, user: auth.user });
}