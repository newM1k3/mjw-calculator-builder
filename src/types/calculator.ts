export type InputType = 'number' | 'select' | 'toggle';

export interface SelectOption {
  label: string;
  value: string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  variableName: string;
  type: InputType;
  defaultValue: string | number | boolean;
  options?: SelectOption[];
}

export interface CalculatorConfig {
  inputs: CalculatorInput[];
  formula: string;
  resultLabel: string;
}

export interface CalculatorState extends CalculatorConfig {
  inputValues: Record<string, number | string | boolean>;
}
