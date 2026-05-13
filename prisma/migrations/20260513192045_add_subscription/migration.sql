-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('starter', 'growth', 'pro', 'enterprise', 'custom');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'paused', 'past_due', 'cancelled');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "managementCompanyId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'starter',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "cartografiaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "insightsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "calculadorasEnabled" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "source" TEXT NOT NULL DEFAULT 'manual_gf',
    "externalId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_managementCompanyId_key" ON "Subscription"("managementCompanyId");

-- CreateIndex
CREATE INDEX "Subscription_status_endDate_idx" ON "Subscription"("status", "endDate");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_managementCompanyId_fkey" FOREIGN KEY ("managementCompanyId") REFERENCES "ManagementCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;
