/*
  Warnings:

  - You are about to drop the column `tautlliLibraryIds` on the `Settings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "radarrUrl" TEXT,
    "radarrApiKey" TEXT,
    "radarrAddImportListExclusion" BOOLEAN NOT NULL DEFAULT true,
    "tautulliUrl" TEXT,
    "tautulliApiKey" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "syncDays" INTEGER DEFAULT 1,
    "syncHour" INTEGER DEFAULT 3,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("createdAt", "enabled", "id", "radarrAddImportListExclusion", "radarrApiKey", "radarrUrl", "syncDays", "syncHour", "tautulliApiKey", "tautulliUrl", "updatedAt") SELECT "createdAt", "enabled", "id", "radarrAddImportListExclusion", "radarrApiKey", "radarrUrl", "syncDays", "syncHour", "tautulliApiKey", "tautulliUrl", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
