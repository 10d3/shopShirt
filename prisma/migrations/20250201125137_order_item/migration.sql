/*
  Warnings:

  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "digitalAssetUrl" TEXT,
ADD COLUMN     "productDescription" TEXT,
ADD COLUMN     "productImage" TEXT,
ADD COLUMN     "productName" TEXT NOT NULL;
