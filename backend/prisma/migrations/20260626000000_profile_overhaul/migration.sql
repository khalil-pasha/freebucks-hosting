-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailAlertServerExpiry" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "emailAlertServerSuspension" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "emailAlertPayment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "emailAlertPromotional" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "location" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "userAgent" TEXT,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");

-- CreateIndex
CREATE INDEX "UserSession_isRevoked_idx" ON "UserSession"("isRevoked");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
