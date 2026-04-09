import { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { BuilderPanel } from './components/BuilderPanel';
import { CalculatorPreview } from './components/CalculatorPreview';
import { CalculatorConfig, CalculatorInput } from './types/calculator';

const STORAGE_KEY = 'mjw-calculator-builder-state';

const defaultConfig: CalculatorConfig = {
  inputs: [],
  formula: '',
  resultLabel: 'Result'
};

function App() {
  const [config, setConfig] = useState<CalculatorConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return defaultConfig;
  });

  const [formulaError, setFormulaError] = useState<string | undefined>();
  const [saveNotification, setSaveNotification] = useState(false);

  // Auto-save to localStorage whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [config]);

  const handleInputsChange = useCallback((inputs: CalculatorInput[]) => {
    setConfig(prev => ({ ...prev, inputs }));
  }, []);

  const handleFormulaChange = useCallback((formula: string) => {
    setConfig(prev => ({ ...prev, formula }));
  }, []);

  const handleResultLabelChange = useCallback((resultLabel: string) => {
    setConfig(prev => ({ ...prev, resultLabel }));
  }, []);

  const handleImport = useCallback((importedConfig: CalculatorConfig) => {
    setConfig(importedConfig);
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2000);
  }, []);

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save configuration');
    }
  }, [config]);

  const handleFormulaError = useCallback((error?: string) => {
    setFormulaError(error);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <Header
        config={config}
        onImport={handleImport}
        onSave={handleSave}
      />

      {saveNotification && (
        <div className="fixed top-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          Saved successfully!
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2">
          <BuilderPanel
            inputs={config.inputs}
            formula={config.formula}
            resultLabel={config.resultLabel}
            onInputsChange={handleInputsChange}
            onFormulaChange={handleFormulaChange}
            onResultLabelChange={handleResultLabelChange}
            formulaError={formulaError}
          />
        </div>

        <div className="w-1/2">
          <CalculatorPreview
            inputs={config.inputs}
            formula={config.formula}
            resultLabel={config.resultLabel}
            onFormulaError={handleFormulaError}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
