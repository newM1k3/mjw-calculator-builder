import { Trash2 } from 'lucide-react';
import { CalculatorInput, InputType } from '../types/calculator';

interface InputFieldEditorProps {
  input: CalculatorInput;
  onUpdate: (input: CalculatorInput) => void;
  onDelete: () => void;
}

export function InputFieldEditor({ input, onUpdate, onDelete }: InputFieldEditorProps) {
  const handleTypeChange = (type: InputType) => {
    let defaultValue: string | number | boolean = '';

    if (type === 'number') {
      defaultValue = 0;
    } else if (type === 'toggle') {
      defaultValue = false;
    } else if (type === 'select') {
      defaultValue = '';
    }

    onUpdate({
      ...input,
      type,
      defaultValue,
      options: type === 'select' ? [{ label: 'Option 1', value: 'option1' }] : undefined
    });
  };

  const handleOptionsChange = (optionsStr: string) => {
    const options = optionsStr
      .split(',')
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0)
      .map((opt, idx) => ({
        label: opt,
        value: opt.toLowerCase().replace(/\s+/g, '_') || `option${idx + 1}`
      }));

    onUpdate({
      ...input,
      options,
      defaultValue: options[0]?.value || ''
    });
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={input.label}
              onChange={(e) => onUpdate({ ...input, label: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Price"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Variable Name
            </label>
            <input
              type="text"
              value={input.variableName}
              onChange={(e) => onUpdate({ ...input, variableName: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., price"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Input Type
            </label>
            <select
              value={input.type}
              onChange={(e) => handleTypeChange(e.target.value as InputType)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="number">Number</option>
              <option value="select">Select</option>
              <option value="toggle">Toggle</option>
            </select>
          </div>

          {input.type === 'number' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Default Value
              </label>
              <input
                type="number"
                value={input.defaultValue as number}
                onChange={(e) => onUpdate({ ...input, defaultValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {input.type === 'select' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Options (comma separated)
              </label>
              <input
                type="text"
                value={input.options?.map(opt => opt.label).join(', ') || ''}
                onChange={(e) => handleOptionsChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}
        </div>

        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete input"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
