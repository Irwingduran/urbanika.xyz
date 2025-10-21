-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('PENDING', 'CONTACTED', 'PAYMENT_PENDING', 'PAYMENT_RECEIVED', 'NFT_MINTING', 'NFT_DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "investmentAmount" INTEGER,
    "paymentMethod" TEXT,
    "cryptocurrency" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'PENDING',
    "nftMinted" BOOLEAN NOT NULL DEFAULT false,
    "mintTxHash" TEXT,
    "tokenId" TEXT,
    "source" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "lastEmailType" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
