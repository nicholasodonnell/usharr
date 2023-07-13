-- RedefineTables
PRAGMA foreign_keys = OFF;

CREATE TABLE "new_Settings" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "radarrUrl" TEXT,
  "radarrApiKey" TEXT,
  "tautulliUrl" TEXT,
  "tautulliApiKey" TEXT,
  "tautlliLibraryIds" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "syncDays" INTEGER DEFAULT 1,
  "syncHour" INTEGER DEFAULT 3,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

INSERT INTO
  "new_Settings" (
    "createdAt",
    "enabled",
    "id",
    "radarrApiKey",
    "radarrUrl",
    "syncDays",
    "syncHour",
    "tautulliApiKey",
    "tautulliUrl",
    "tautlliLibraryIds",
    "updatedAt"
  )
SELECT
  "createdAt",
  "enabled",
  "id",
  "radarrApiKey",
  "radarrUrl",
  "syncDays",
  "syncHour",
  "tautulliApiKey",
  "tautulliUrl",
  cast("tautlliLibraryId" as text) as "tautlliLibraryIds",
  "updatedAt"
FROM
  "Settings";

DROP TABLE "Settings";

ALTER TABLE
  "new_Settings" RENAME TO "Settings";

PRAGMA foreign_key_check;

PRAGMA foreign_keys = ON;
