import { Calculator } from 'lucide-react';
import { CalculatorInput } from '../types/calculator';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { useMemo, useState } from 'react';

interface CalculatorPreviewProps {
  inputs: CalculatorInput[];
  formula: string;
  resultLabel: string;
  onFormulaError: (error?: string) => void;
}

export function CalculatorPreview({
  inputs,
  formula,
  resultLabel,
  onFormulaError
}: CalculatorPreviewProps) {
  const [inputValues, setInputValues] = useState<Record<string, number | string | boolean>>(() => {
    const initial: Record<string, number | string | boolean> = {};
    inputs.forEach(input => {
      initial[input.variableName] = input.defaultValue;
    });
    return initial;
  });

  // Update input values when inputs change
  useMemo(() => {
    const newValues: Record<string, number | string | boolean> = {};
    inputs.forEach(input => {
      newValues[input.variableName] = inputValues[input.variableName] ?? input.defaultValue;
    });
    setInputValues(newValues);
  }, [inputs]);

  const result = useMemo(() => {
    if (!formula.trim()) {
      onFormulaError('Formula is empty');
      return null;
    }

    const evaluation = evaluateFormula(formula, inputValues);

    if (!evaluation.success) {
      onFormulaError(evaluation.error);
      return null;
    }

    onFormulaError(undefined);
    return evaluation.value;
  }, [formula, inputValues, onFormulaError]);

  const handleInputChange = (variableName: string, value: number | string | boolean) => {
    setInputValues(prev => ({
      ...prev,
      [variableName]: value
    }));
  };

  if (inputs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center px-8 py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No Calculator Yet
          </h3>
          <p className="text-slate-500 text-sm max-w-sm">
            Add input fields and define a formula to see your calculator preview here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calculator className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Calculator Preview</h2>
          </div>

          <div className="space-y-4 mb-6">
            {inputs.map((input) => (
              <div key={input.id}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {input.label}
                </label>

                {input.type === 'number' && (
                  <input
                    type="number"
                    value={inputValues[input.variableName] as number}
                    onChange={(e) => handleInputChange(input.variableName, parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}

                {input.type === 'select' && (
                  <select
                    value={inputValues[input.variableName] as string}
                    onChange={(e) => handleInputChange(input.variableName, e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {input.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {input.type === 'toggle' && (
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputValues[input.variableName] as boolean}
                      onChange={(e) => handleInputChange(input.variableName, e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">
                      {(inputValues[input.variableName] as boolean) ? 'Yes' : 'No'}
                    </span>
                  </label>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200">
            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="text-sm font-medium text-indigo-900 mb-2">
                {resultLabel || 'Result'}
              </div>
              {result !== null ? (
                <div className="text-3xl font-bold text-indigo-600">
                  {result.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })}
                </div>
              ) : (
                <div className="text-sm text-red-600">
                  Unable to calculate result
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
