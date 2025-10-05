/*
  Warnings:

  - Made the column `description` on table `Concert` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Concert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Concert" ("createdAt", "description", "id", "name", "totalSeats") SELECT "createdAt", "description", "id", "name", "totalSeats" FROM "Concert";
DROP TABLE "Concert";
ALTER TABLE "new_Concert" RENAME TO "Concert";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
