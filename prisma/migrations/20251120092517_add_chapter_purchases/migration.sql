-- AlterTable
ALTER TABLE "public"."chapters" ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" INTEGER;

-- CreateTable
CREATE TABLE "public"."chapter_purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chapter_purchases_stripePaymentIntentId_key" ON "public"."chapter_purchases"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "chapter_purchases_userId_idx" ON "public"."chapter_purchases"("userId");

-- CreateIndex
CREATE INDEX "chapter_purchases_chapterId_idx" ON "public"."chapter_purchases"("chapterId");

-- CreateIndex
CREATE INDEX "chapter_purchases_status_idx" ON "public"."chapter_purchases"("status");

-- CreateIndex
CREATE UNIQUE INDEX "chapter_purchases_userId_chapterId_key" ON "public"."chapter_purchases"("userId", "chapterId");

-- AddForeignKey
ALTER TABLE "public"."chapter_purchases" ADD CONSTRAINT "chapter_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chapter_purchases" ADD CONSTRAINT "chapter_purchases_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "public"."chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
