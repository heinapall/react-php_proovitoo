import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

interface ImportCardProps {
  importUrl: string;
  setImportUrl: (val: string) => void;
  onImport: (e: React.FormEvent) => void;
  importing: boolean;
  message: string;
  importedCount?: number | null;
}

const ImportCard: React.FC<ImportCardProps> = ({
  importUrl,
  setImportUrl,
  onImport,
  importing,
  message,
  importedCount
}) => {
  const { t } = useTranslation();

  return (
    <div className="opus-card card-secondary-import">
      <h3>{t('import.card_title')}</h3>
      <p>{t('import.description')}</p>
      
      <form onSubmit={onImport}>
        <input 
            type="text" 
            value={importUrl} 
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder={t('import.placeholder')}
        />
        <Button 
            type="submit" 
            className="btn-import" 
            disabled={importing}
        >
            {importing ? t('import.processing') : t('import.button')}
        </Button>
      </form>

      {(message || importedCount) && (
        <p className="status-msg" style={{color: '#0056b3'}}>
          {importedCount 
            ? t('import.success', { count: importedCount }) 
            : message
          }
        </p>
      )}
    </div>
  );
};

export default ImportCard;