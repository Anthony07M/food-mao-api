/*
  Warnings:

  - You are about to drop the column `notes` on the `order_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "notes" TEXT;
