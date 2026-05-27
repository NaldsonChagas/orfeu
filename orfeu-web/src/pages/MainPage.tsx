import './MainPage.css';

function MainPage() {
  return (
    <>
      <nav className="top-nav">
        <div className="top-nav-inner">
          <div className="top-nav-content">
            <h1 className="top-nav-title">Orfeu</h1>
            <p className="top-nav-subtitle">Seu recomendador de novas músicas</p>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <header className="main-header">
          {/* <SearchBar /> */}
          {/* <SearchResultList /> */}
        </header>

        <section className="search-section">
          <div className="search-wrapper">
            <span className="search-icon material-symbols-outlined">search</span>
            <input
              className="search-input"
              type="text"
              placeholder="Buscar álbuns ou artistas..."
              aria-label="Search albums"
            />
          </div>
        </section>

        {/* <LibraryGrid /> */}
        {/* <RecommendationsSection /> */}

        <section className="empty-state">
          <span className="empty-state-icon material-symbols-outlined">library_music</span>
          <h2 className="empty-state-title">Sua biblioteca está vazia</h2>
          <p className="empty-state-description">
            Adicione álbuns na sua biblioteca para começar a receber recomendações precisas.
          </p>
        </section>
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
          <span className="material-symbols-outlined bottom-nav-icon bottom-nav-icon--filled">home</span>
          <span className="bottom-nav-label">Início</span>
        </a>
        <a className="bottom-nav-item" href="#">
          <span className="material-symbols-outlined bottom-nav-icon">explore</span>
          <span className="bottom-nav-label">Explorar</span>
        </a>
        <a className="bottom-nav-item" href="#">
          <span className="material-symbols-outlined bottom-nav-icon">library_music</span>
          <span className="bottom-nav-label">Biblioteca</span>
        </a>
      </nav>

      <div className="bottom-nav-spacer" />
    </>
  );
}

export default MainPage;