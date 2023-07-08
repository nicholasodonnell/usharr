export type RadarrTag = {
  id: number
  label: string
}

export type RadarrImage = {
  coverType: 'poster' | 'fanart'
  url: string
  remoteUrl: string
}

export type RadarrRating = {
  votes: number
  value: number
  type: string
}

export type RadarrMovie = {
  id: number
  title: string
  alternateTitles: {
    title: string
  }[]
  tmdbId: number
  images: RadarrImage[]
  hasFile: boolean
  imdbId: string
  tags: number[]
  added: Date
  ratings: {
    imdb: RadarrRating
    tmdb: RadarrRating
    metacritic: RadarrRating
    rottenTomatoes: RadarrRating
  }
  movieFile: {
    dateAdded: Date
  }
}

export type RadarrMediaManagement = {
  autoRenameFolders: boolean
  autoUnmonitorPreviouslyDownloadedMovies: boolean
  chmodFolder: string
  chownGroup: string
  copyUsingHardlinks: boolean
  createEmptyMovieFolders: boolean
  deleteEmptyFolders: boolean
  downloadPropersAndRepacks: string
  enableMediaInfo: boolean
  extraFileExtensions: string
  fileDate: string
  id: number
  importExtraFiles: boolean
  minimumFreeSpaceWhenImporting: number
  pathsDefaultStatic: boolean
  recycleBin: string
  recycleBinCleanupDays: number
  rescanAfterRefresh: string
  scriptImportPath: string
  setPermissionsLinux: boolean
  skipFreeSpaceCheckWhenImporting: boolean
  useScriptImport: boolean
}
export type RadarrPing = {
  success: boolean
  hasRecycleBin?: boolean
}
