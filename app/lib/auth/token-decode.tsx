import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { JwtPayload } from "../definitions";
import jwt from "jsonwebtoken";

export async function jwtDecode(): Promise<JwtPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value; // giả sử cookie tên là "token"

  // Decode JWT mà không verify
  const jwtPayload = jwt.decode(token!) as JwtPayload | null;

  if (!token || !jwtPayload) {
    redirect("/login");
  }
  return jwtPayload;
}
