/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Application` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ApplicationToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ApplicationToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ApplicationToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "iconType" TEXT NOT NULL DEFAULT 'SVG',
    "iconValue" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Application" ("createdAt", "description", "iconType", "iconValue", "id", "name", "updatedAt", "url") SELECT "createdAt", "description", "iconType", "iconValue", "id", "name", "updatedAt", "url" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToCategory_AB_unique" ON "_ApplicationToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToCategory_B_index" ON "_ApplicationToCategory"("B");
