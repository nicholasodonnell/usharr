-- AlterTable
ALTER TABLE
  "Rule"
ADD
  COLUMN "appearsInList" BOOLEAN;

-- RedefineTables
PRAGMA foreign_keys = OFF;

CREATE TABLE "new_Movie" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "title" TEXT NOT NULL,
  "alternativeTitles" TEXT,
  "tmdbId" INTEGER,
  "poster" TEXT,
  "watched" BOOLEAN NOT NULL DEFAULT false,
  "lastWatchedAt" DATETIME,
  "ignored" BOOLEAN NOT NULL DEFAULT false,
  "deleted" BOOLEAN NOT NULL DEFAULT false,
  "downloadedAt" DATETIME NOT NULL,
  "imdbRating" REAL,
  "tmdbRating" REAL,
  "metacriticRating" REAL,
  "rottenTomatoesRating" REAL,
  "appearsInList" BOOLEAN NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  "deletedAt" DATETIME
);

INSERT INTO
  "new_Movie" (
    "alternativeTitles",
    "appearsInList",
    "createdAt",
    "deleted",
    "deletedAt",
    "downloadedAt",
    "id",
    "ignored",
    "imdbRating",
    "lastWatchedAt",
    "metacriticRating",
    "poster",
    "rottenTomatoesRating",
    "title",
    "tmdbId",
    "tmdbRating",
    "updatedAt",
    "watched"
  )
SELECT
  "alternativeTitles",
  FALSE as "appearsInList",
  "createdAt",
  "deleted",
  "deletedAt",
  "downloadedAt",
  "id",
  "ignored",
  "imdbRating",
  "lastWatchedAt",
  "metacriticRating",
  "poster",
  "rottenTomatoesRating",
  "title",
  "tmdbId",
  "tmdbRating",
  "updatedAt",
  "watched"
FROM
  "Movie";

DROP TABLE "Movie";

ALTER TABLE
  "new_Movie" RENAME TO "Movie";

PRAGMA foreign_key_check;

PRAGMA foreign_keys = ON;
