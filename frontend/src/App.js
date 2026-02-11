import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import NavBar from './components/NavBar.tsx';
import SearchCard from './components/SearchCard';
import ImportCard from './components/ImportCard';

function App() {
  const { t, i18n } = useTranslation();
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(null); 
  const [importErrorKey, setImportErrorKey] = useState(null);
  const [importRawError, setImportRawError] = useState(null);
  const [word, setWord] = useState('');
  const [anagrams, setAnagrams] = useState([]);
  const [searchedWord, setSearchedWord] = useState('');
  const [searchError, setSearchError] = useState(null);
  const [wordExists, setWordExists] = useState(true);

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    setImporting(true);
    setImportErrorKey(null);
    setImportRawError(null);
    setImportedCount(null); 

    try {
      const response = await fetch('http://127.0.0.1:8000/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl })
      });

      const data = await response.json();

      if (response.ok) {
        setImportedCount(data.words_imported);
      } else {
        if (data.error_code) {
            setImportErrorKey(`errors.${data.error_code}`);
        } else {
            if (data.error) {
                setImportRawError(data.error);
            } else {
                setImportErrorKey('errors.import_failed');
            }
        }
      }
    } catch (err) {
      setImportErrorKey('errors.connection');
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
        setSearchError(t('errors.search_failed'));
      }
    } catch (err) {
      setSearchError(t('errors.connection'));
    }
  };

  let displayMessage = '';
  
  if (importErrorKey) {
      const translated = t(importErrorKey);
      displayMessage = `${t('errors.prefix')}${translated}`;
  } else if (importRawError) {
      displayMessage = `${t('errors.prefix')}${importRawError}`;
  }

  return (
    <div className="App">
      <NavBar />
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
          <SearchCard 
            word={word}
            setWord={setWord}
            onSearch={handleSearchSubmit}
            searchedWord={searchedWord}
            anagrams={anagrams}
            error={searchError}
            wordExists={wordExists}
          />
          <ImportCard 
            importUrl={importUrl}
            setImportUrl={setImportUrl}
            onImport={handleImportSubmit}
            importing={importing}
            message={displayMessage}
            importedCount={importedCount}
          />
        </div>
      </section>
    </div>
  );
}

export default App;