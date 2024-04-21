// lib/utils.ts
import { NextApiRequest } from "next";

export function extractIp(req: NextApiRequest): string | undefined {
  const xForwardedFor = req.headers["x-forwarded-for"];

  if (typeof xForwardedFor === "string") {
    return xForwardedFor.split(",").shift();
  } else if (Array.isArray(xForwardedFor)) {
    return xForwardedFor[0];
  } else {
    return req.socket.remoteAddress;
  }
}
