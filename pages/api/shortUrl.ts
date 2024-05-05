import { extractIp } from "@/lib/ip";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function handleExistingLink(ip: string, linkId: number) {
  await prisma.$transaction(async (prisma) => {
    const accessLog = await prisma.accessLog.findFirst({
      where: { linkId, ip },
    });

    if (accessLog) {
      await prisma.accessLog.update({
        where: { id: accessLog.id },
        data: { timesAccessed: { increment: 1 } },
      });
    } else {
      await prisma.accessLog.create({
        data: { ip, linkId },
      });
    }
  });
}

export async function createLinkAndLog(ip: string, url: string) {
  const shortUrl = Math.random().toString(36).substring(2, 10);
  const link = await prisma.link.create({
    data: { url, shortUrl },
  });

  await prisma.accessLog.create({
    data: { ip, linkId: link.id },
  });

  return link;
}

async function shortUrlHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { url }: { url: string } = req.body;
  const ip = extractIp(req) ?? "unknown";

  if (!url) {
    return res
      .status(400)
      .json({ error: "URL parameter is missing or invalid" });
  }
  const normalizedUrl = url.toLowerCase();
  try {
    const existingLink = await prisma.link.findUnique({
      where: { url: normalizedUrl },
    });

    if (existingLink) {
      return res.status(200).json(existingLink);
    } else {
      const newLink = await createLinkAndLog(ip, normalizedUrl);
      return res.status(201).json(newLink);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

export default shortUrlHandler;
