import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();

  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  
  const [word, setWord] = useState('');
  const [anagrams, setAnagrams] = useState([]);
  const [searchedWord, setSearchedWord] = useState('');
  const [searchError, setSearchError] = useState(null);
  const [wordExists, setWordExists] = useState(true);

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    setImporting(true);
    setImportMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl })
      });

      const data = await response.json();
      if (response.ok) {
        setImportMessage(`Success! Imported ${data.words_imported} words.`);
      } else {
        setImportMessage(`Error: ${data.error || 'Import failed'}`);
      }
    } catch (err) {
      setImportMessage('Error: Could not connect to backend.');
    } finally {
      setImporting(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSearchError(null);
    setAnagrams([]);
    setSearchedWord('');
    setWordExists(true);

    if (!word.trim()) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/anagrams/${word}`);
      const data = await response.json();

      if (response.ok) {
        setSearchedWord(data.searched_for);
        setAnagrams(data.anagrams);
        setWordExists(data.word_exists);
      } else {
        setSearchError('Search failed.');
      }
    } catch (err) {
      setSearchError('Error: Could not connect to backend.');
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'et' ? 'en' : 'et';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="App">
      <nav className="opus-nav">
        <div className="logo"><span className="logo-icon">📍</span> OPUS</div>
        <div className="nav-links">
          <div className="lang-switch-container">
            <span className={`lang-label ${i18n.language === 'et' ? 'active' : ''}`}>ET</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={i18n.language === 'en'} 
                onChange={toggleLanguage} 
              />
              <span className="slider round"></span>
            </label>
            <span className={`lang-label ${i18n.language === 'en' ? 'active' : ''}`}>EN</span>
          </div>
          
          <a href="http://127.0.0.1:8000/api/doc" target="_blank" rel="noreferrer" className="nav-btn">
            {t('header.api_docs')} →
          </a>
        </div>
      </nav>

      <div className="background-decor">
         <div className="shape-main"></div>
         <div className="shape-orange"></div>
         <div className="shape-blue"></div>
      </div>

      <section className="forms-container">
        <h2 className="section-title">
          <span className="red-arrow">▶</span> {t('hero.title')}
        </h2>

        <div className="cards-grid">
          
          <div className="opus-card card-primary-search">
            <h3>{t('search.card_title')}</h3>
            <p>{t('search.description')}</p>
            
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={word}
                onChange={(e) => setWord(e.target.value)}
                autoFocus 
              />
              <button type="submit" className="btn-search">{t('search.button')}</button>
            </form>

            {searchError && <p style={{color: 'red', marginTop: '10px'}}>{searchError}</p>}
            
            {searchedWord && (
              <div className="results">
                
                {!wordExists && (
                  <div className="warning-box">
                    {t('search.word_not_found', { word: searchedWord })}
                  </div>
                )}

                {wordExists && (
                  <>
                    <p>{t('search.results_label')} <strong>{searchedWord}</strong></p>
                    {anagrams.length > 0 ? (
                      <ul>{anagrams.map((w, i) => <li key={i}>{w}</li>)}</ul>
                    ) : (
                      <span>{t('search.no_results')}</span>
                    )}
                  </>
                )}

              </div>
            )}
          </div>

          <div className="opus-card card-secondary-import">
            <h3>{t('import.card_title')}</h3>
            <p>{t('import.description')}</p>
            
            <form onSubmit={handleImportSubmit}>
              <input 
                type="text" 
                value={importUrl} 
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder={t('import.placeholder')}
              />
              <button type="submit" className="btn-import" disabled={importing}>
                {importing ? t('import.processing') : t('import.button')}
              </button>
            </form>
            {importMessage && <p className="status-msg" style={{color: '#0056b3'}}>{importMessage}</p>}
          </div>

        </div>
      </section>
    </div>
  );
}

export default App;