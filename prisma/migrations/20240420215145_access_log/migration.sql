-- CreateTable
CREATE TABLE "AccessLog" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timesAccessed" INTEGER NOT NULL DEFAULT 0,
    "linkId" INTEGER,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;
