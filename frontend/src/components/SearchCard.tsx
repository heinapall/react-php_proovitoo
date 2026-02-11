import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

interface SearchCardProps {
  word: string;
  setWord: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  searchedWord: string;
  anagrams: string[];
  error: string | null;
  wordExists: boolean;
}

const SearchCard: React.FC<SearchCardProps> = ({
  word,
  setWord,
  onSearch,
  searchedWord,
  anagrams,
  error,
  wordExists
}) => {
  const { t } = useTranslation();

  return (
    <div className="opus-card card-primary-search">
      <h3>{t('search.card_title')}</h3>
      <p>{t('search.description')}</p>
      <form onSubmit={onSearch}>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={word}
          onChange={(e) => setWord(e.target.value)}
          autoFocus 
        />
        <Button type="submit" className="btn-search">
            {t('search.button')}
        </Button>
      </form>
      {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
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
  );
};

export default SearchCard;