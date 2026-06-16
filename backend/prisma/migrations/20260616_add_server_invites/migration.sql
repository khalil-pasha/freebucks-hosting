-- CreateTable
CREATE TABLE "ServerInvite" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "email" TEXT,
    "discordId" TEXT,
    "permissions" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerInvite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServerInvite" ADD CONSTRAINT "ServerInvite_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
