import { extractIp } from "@/lib/ip";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import React from "react";
import { handleExistingLink } from "./api/shortUrl";

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

  if (!link) {
    await prisma.$disconnect();

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  await handleExistingLink(ip!, link.id);
  await prisma.$disconnect();

  return {
    redirect: {
      destination: `http://${link.url}`,
    },
  };
}
