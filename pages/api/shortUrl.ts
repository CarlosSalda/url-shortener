import { extractIp } from "@/lib/ip";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const shortUrlHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { url }: { url: string } = req.body;
  const shortUrl: string = Math.random().toString(36).substring(2, 10);
  const prisma = new PrismaClient();
  const ip = extractIp(req);
  try {
    if (!url) {
      return res
        .status(400)
        .json({ error: "URL parameter is missing or invalid" });
    }

    const existingLink = await prisma.link.findFirst({
      where: {
        url,
      },
    });

    if (existingLink) {
      return res.status(200).send(existingLink);
    }

    const data = await prisma.link.create({
      data: {
        url,
        shortUrl,
      },
    });

    await prisma.accessLog.create({
      data: {
        ip: ip || "unknown",
        linkId: data.id,
      },
    });

    await prisma.$disconnect();

    return res.status(201).send(data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export default shortUrlHandler;
