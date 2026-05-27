import { useState, useCallback, useEffect } from 'react';
import type { AlbumDTO } from '@/types';
import { searchAlbums } from '@/services/albums.service';
import { getLibrary, addToLibrary } from '@/services/library.service';
import SearchResultCard from '@/components/search/SearchResultCard';
import LibraryGrid from '@/components/library/LibraryGrid';
import './MainPage.css';

function MainPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AlbumDTO[]>([]);
  const [libraryAlbums, setLibraryAlbums] = useState<AlbumDTO[]>([]);
  const [isLibraryLoading, setIsLibraryLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [addingIds, setAddingIds] = useState<Set<string>>(new Set());
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    getLibrary()
      .then((albums) => setLibraryAlbums(albums))
      .catch(() => {
        setLibraryAlbums([]);
      })
      .finally(() => setIsLibraryLoading(false));
  }, []);

  const libraryIds = new Set(libraryAlbums.map((a) => a.id));

  const handleRemove = useCallback((albumId: string) => {
    setLibraryAlbums((prev) => prev.filter((a) => a.id !== albumId));
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setHasSearched(false);
  }, []);

  const handleSearchSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setHasSearched(true);
    setIsSearching(true);
    try {
      const data = await searchAlbums(trimmed);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleAdd = useCallback(async (album: AlbumDTO) => {
    setAddingIds((prev) => new Set(prev).add(album.id));
    try {
      await addToLibrary(album);
      setLibraryAlbums((prev) => [...prev, album]);
    } catch {
      // silently fail - user can retry
    } finally {
      setAddingIds((prev) => {
        const next = new Set(prev);
        next.delete(album.id);
        return next;
      });
    }
  }, []);

  return (
    <>
      <nav className="top-nav">
        <div className="top-nav-inner">
          <div className="top-nav-content">
            <h1 className="top-nav-title">Orfeu</h1>
            <p className="top-nav-subtitle">
              Seu recomendador de novas músicas
            </p>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <header className="main-header"></header>

        <section className="search-section">
          <form className="search-wrapper" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <span className="search-input-icon material-symbols-outlined">
                search
              </span>
              <input
                className="search-input"
                type="text"
                placeholder="Buscar álbuns ou artistas..."
                aria-label="Search albums"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="search-submit-btn"
              aria-label="Search"
            >
              <span className="material-symbols-outlined">search</span>
              Buscar
            </button>
          </form>
        </section>

        {hasSearched && (
          <section className="w-full max-w-2xl flex flex-col gap-sm">
            {isSearching ? (
              <p className="font-body-md text-body-md text-secondary text-center py-md">
                Buscando...
              </p>
            ) : results.length > 0 ? (
              results.map((album) => (
                <SearchResultCard
                  key={album.id}
                  album={album}
                  isInLibrary={libraryIds.has(album.id)}
                  isAdding={addingIds.has(album.id)}
                  onAdd={handleAdd}
                />
              ))
            ) : (
              <p className="font-body-md text-body-md text-secondary text-center py-md">
                Nenhum álbum encontrado para &quot;{query}&quot;.
              </p>
            )}
          </section>
        )}

        {!hasSearched && (
          <LibraryGrid
            albums={libraryAlbums}
            isLoading={isLibraryLoading}
            onRemove={handleRemove}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-content">
            <p className="footer-text">Feito com ❤️ por Naldson Bento</p>
          </div>
        </div>
      </footer>

      <nav className="bottom-nav">
        <a className="bottom-nav-item bottom-nav-item--active" href="#">
          <span className="material-symbols-outlined bottom-nav-icon bottom-nav-icon--filled">
            home
          </span>
          <span className="bottom-nav-label">Início</span>
        </a>
        <a className="bottom-nav-item" href="#">
          <span className="material-symbols-outlined bottom-nav-icon">
            explore
          </span>
          <span className="bottom-nav-label">Explorar</span>
        </a>
        <a className="bottom-nav-item" href="#">
          <span className="material-symbols-outlined bottom-nav-icon">
            library_music
          </span>
          <span className="bottom-nav-label">Biblioteca</span>
        </a>
      </nav>

      <div className="bottom-nav-spacer" />
    </>
  );
}

export default MainPage;
