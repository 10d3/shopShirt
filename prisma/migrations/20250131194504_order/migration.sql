/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "posts";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "txd" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "sender" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "orderId" TEXT,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_txd_key" ON "Verification"("txd");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_orderId_key" ON "Verification"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
