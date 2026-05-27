# Orfeu Web

Front-end of the Orfeu platform, built with React and Vite.

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