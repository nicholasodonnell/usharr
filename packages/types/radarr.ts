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
  added: string
  alternateTitles: {
    sourceType: string
    movieMetadataId: number
    title: string
    sourceId: number
    votes: number
    voteCount: number
    language: {
      id: number
      name: string
    }
    id: number
  }[]
  certification: string
  cleanTitle: string
  digitalRelease: string
  folderName: string
  genres: string[]
  hasFile: boolean
  id: number
  images: {
    coverType: string
    url: string
    remoteUrl: string
  }[]
  imdbId: string
  inCinemas: string
  isAvailable: boolean
  minimumAvailability: string
  monitored: boolean
  movieFile: {
    movieId: number
    relativePath: string
    path: string
    size: number
    dateAdded: Date
    sceneName: string
    indexerFlags: number
    quality: {
      quality: {
        id: number
        name: string
        source: string
        resolution: number
        modifier: string
      }
      revision: {
        version: number
        real: number
        isRepack: boolean
      }
    }
    mediaInfo: {
      audioBitrate: number
      audioChannels: number
      audioCodec: string
      audioLanguages: string
      audioStreamCount: number
      videoBitDepth: number
      videoBitrate: number
      videoCodec: string
      videoDynamicRangeType: string
      videoFps: number
      resolution: string
      runTime: string
      scanType: string
      subtitles: string
    }
    originalFilePath: string
    qualityCutoffNotMet: boolean
    languages: {
      id: number
      name: string
    }[]
    releaseGroup: string
    edition: string
    id: number
  }
  originalLanguage: {
    id: number
    name: string
  }
  originalTitle: string
  overview: string
  path: string
  physicalRelease: string
  popularity: number
  qualityProfileId: number
  ratings: {
    [key: string]: {
      votes: number
      value: number
      type: string
    }
  }
  rootFolderPath: string
  runtime: number
  secondaryYearSourceId: number
  sizeOnDisk: number
  sortTitle: string
  status: string
  studio: string
  tags: number[]
  title: string
  titleSlug: string
  tmdbId: number
  website: string
  year: number
  youTubeTrailerId: string
}

export type ImportlistMovie = {
  certification: string
  collection: {
    tmdbId: number
    monitored: boolean
    qualityProfileId: number
    searchOnAdd: boolean
    minimumAvailability: string
    images: any[]
    added: string
    id: number
  }
  folder: string
  genres: string[]
  images: {
    coverType: string
    url: string
  }[]
  imdbId: string
  inCinemas: string
  isExcluded: boolean
  isExisting: boolean
  isRecommendation: boolean
  lists: number[]
  originalLanguage: {
    id: number
    name: string
  }
  overview: string
  ratings: {
    [key: string]: {
      votes: number
      value: number
      type: string
    }
  }
  remotePoster: string
  runtime: number
  sortTitle: string
  status: string
  studio: string
  title: string
  tmdbId: number
  website: string
  year: number
  youTubeTrailerId: string
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
