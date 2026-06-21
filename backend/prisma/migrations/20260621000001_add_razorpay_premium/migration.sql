-- AlterTable
ALTER TABLE "PremiumOrder" ADD COLUMN "amount" DOUBLE PRECISION NOT NULL DEFAULT 549,
ADD COLUMN "expiresAt" TIMESTAMP(3),
ADD COLUMN "plan" TEXT NOT NULL DEFAULT 'Premium',
ADD COLUMN "razorpayOrderId" TEXT,
ADD COLUMN "razorpayPaymentId" TEXT,
ADD COLUMN "startsAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "PremiumOrder_razorpayOrderId_key" ON "PremiumOrder"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "PremiumOrder_razorpayPaymentId_key" ON "PremiumOrder"("razorpayPaymentId");
