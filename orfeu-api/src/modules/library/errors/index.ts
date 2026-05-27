export const ALBUM_ALREADY_EXISTS = 'ALBUM_ALREADY_EXISTS' as const;
export const ALBUM_NOT_FOUND = 'ALBUM_NOT_FOUND' as const;

export type AlbumErrorType =
  | typeof ALBUM_ALREADY_EXISTS
  | typeof ALBUM_NOT_FOUND;

export class LibraryError extends Error {
  constructor(
    public readonly type: AlbumErrorType,
    message: string,
  ) {
    super(message);
    this.name = 'LibraryError';
  }
}

export function albumAlreadyExistsError(albumId: string): LibraryError {
  return new LibraryError(
    ALBUM_ALREADY_EXISTS,
    `Album with id "${albumId}" already exists in the library`,
  );
}

export function albumNotFoundError(albumId: string): LibraryError {
  return new LibraryError(
    ALBUM_NOT_FOUND,
    `Album with id "${albumId}" was not found in the library`,
  );
}

export function isAlbumError(
  error: unknown,
  type: AlbumErrorType,
): error is LibraryError {
  return error instanceof LibraryError && error.type === type;
}
