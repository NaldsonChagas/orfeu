# Orfeu Web

React front-end for the Orfeu music discovery platform. It consumes the Orfeu API to display album and artist information in a user-friendly interface.

## Folder Structure

```
src/
├── components/
│   ├── albums/          # Album-related components
│   ├── library/          # User library components
│   └── recommendations/  # Recommendation components
├── hooks/               # Custom hooks
├── pages/               # Application pages
├── services/            # API calls and business logic
└── types/               # JSDoc type definitions
```

## Absolute Imports

Use `@/` as a shortcut for `src/`. Example:

```js
import { getAlbums } from '@/services/albums';
import { AlbumDTO } from '@/types';
```