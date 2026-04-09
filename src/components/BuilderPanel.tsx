import { Plus } from 'lucide-react';
import { CalculatorInput } from '../types/calculator';
import { InputFieldEditor } from './InputFieldEditor';

interface BuilderPanelProps {
  inputs: CalculatorInput[];
  formula: string;
  resultLabel: string;
  onInputsChange: (inputs: CalculatorInput[]) => void;
  onFormulaChange: (formula: string) => void;
  onResultLabelChange: (label: string) => void;
  formulaError?: string;
}

export function BuilderPanel({
  inputs,
  formula,
  resultLabel,
  onInputsChange,
  onFormulaChange,
  onResultLabelChange,
  formulaError
}: BuilderPanelProps) {
  const handleAddInput = () => {
    const newInput: CalculatorInput = {
      id: `input_${Date.now()}`,
      label: 'New Input',
      variableName: `input_${inputs.length + 1}`,
      type: 'number',
      defaultValue: 0
    };

    onInputsChange([...inputs, newInput]);
  };

  const handleUpdateInput = (index: number, updatedInput: CalculatorInput) => {
    const newInputs = [...inputs];
    newInputs[index] = updatedInput;
    onInputsChange(newInputs);
  };

  const handleDeleteInput = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    onInputsChange(newInputs);
  };

  return (
    <div className="h-full overflow-y-auto bg-white border-r border-slate-200">
      <div className="p-6 space-y-6">
        {/* Input Fields Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Input Fields</h2>
            <button
              onClick={handleAddInput}
              className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Input
            </button>
          </div>

          {inputs.length === 0 ? (
            <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
              <p className="text-slate-500 text-sm">
                No inputs yet. Click "Add Input" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {inputs.map((input, index) => (
                <InputFieldEditor
                  key={input.id}
                  input={input}
                  onUpdate={(updatedInput) => handleUpdateInput(index, updatedInput)}
                  onDelete={() => handleDeleteInput(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Result Label Section */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Result Label
          </label>
          <input
            type="text"
            value={resultLabel}
            onChange={(e) => onResultLabelChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Total Cost"
          />
        </div>

        {/* Formula Section */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Result Formula
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Use variable names in your formula. Supports: +, -, *, /, (), Math functions
          </p>

          {inputs.length > 0 && (
            <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs">
              <span className="font-medium text-slate-700">Available variables: </span>
              <span className="font-mono text-indigo-600">
                {inputs.map(input => input.variableName).join(', ')}
              </span>
            </div>
          )}

          <textarea
            value={formula}
            onChange={(e) => onFormulaChange(e.target.value)}
            className={`w-full px-3 py-2 bg-white border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] ${
              formulaError ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'
            }`}
            placeholder="e.g., price * (1 + tax_rate / 100)"
          />

          {formulaError && (
            <p className="mt-2 text-xs text-red-600">
              {formulaError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
