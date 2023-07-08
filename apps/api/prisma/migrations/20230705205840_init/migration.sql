-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Movie" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "MovieTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movieId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "MovieTag_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MovieTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "radarrUrl" TEXT,
    "radarrApiKey" TEXT,
    "tautulliUrl" TEXT,
    "tautulliApiKey" TEXT,
    "tautlliLibraryId" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "syncDays" INTEGER DEFAULT 1,
    "syncHour" INTEGER DEFAULT 3,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "downloadedDaysAgo" INTEGER,
    "watched" BOOLEAN,
    "watchedDaysAgo" INTEGER,
    "minimumImdbRating" REAL,
    "minimumTmdbRating" REAL,
    "minimumMetacriticRating" REAL,
    "minimumRottenTomatoesRating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RuleTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ruleId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "RuleTag_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RuleTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sync" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL DEFAULT 'FULL',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieTag_movieId_tagId_key" ON "MovieTag"("movieId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "RuleTag_ruleId_tagId_key" ON "RuleTag"("ruleId", "tagId");
