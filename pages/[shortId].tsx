import { extractIp } from "@/lib/ip";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import React from "react";

export default function TestPage() {
  return <div> Redirect ShortId </div>;
}

interface Params {
  params: {
    shortId: string;
  };
  req: NextApiRequest;
}

export async function getServerSideProps(context: Params) {
  const { params, req } = context;
  const { shortId } = params;

  if (!shortId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const prisma = new PrismaClient();
  const ip = extractIp(req);

  const link = await prisma.link.findUnique({
    where: { shortUrl: shortId },
  });

  await prisma.$transaction([
    prisma.accessLog.updateMany({
      where: {
        linkId: link?.id,
        ip: ip || "unknown",
      },
      data: {
        timesAccessed: {
          increment: 1,
        },
      },
    }),
  ]);

  await prisma.$disconnect();

  if (!link) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: `http://${link.url}`,
    },
  };
}
