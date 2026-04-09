export interface EvaluationResult {
  success: boolean;
  value?: number;
  error?: string;
}

export function evaluateFormula(
  formula: string,
  variables: Record<string, number | string | boolean>
): EvaluationResult {
  if (!formula.trim()) {
    return {
      success: false,
      error: 'Formula is empty'
    };
  }

  try {
    // Convert all variables to numbers for calculation
    const numericVars: Record<string, number> = {};
    for (const [key, value] of Object.entries(variables)) {
      if (typeof value === 'boolean') {
        numericVars[key] = value ? 1 : 0;
      } else {
        const num = Number(value);
        if (isNaN(num)) {
          return {
            success: false,
            error: `Variable '${key}' has invalid numeric value`
          };
        }
        numericVars[key] = num;
      }
    }

    // Create a safe evaluation function
    // Only allow basic math operations and the defined variables
    const allowedVars = Object.keys(numericVars).join('|');
    const varRegex = new RegExp(`\\b(${allowedVars})\\b`, 'g');

    // Check if formula contains any undefined variables
    const formulaVars = formula.match(/\b[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    const undefinedVars = formulaVars.filter(v => !(v in numericVars) && !['Math', 'abs', 'min', 'max', 'floor', 'ceil', 'round', 'sqrt', 'pow'].includes(v));

    if (undefinedVars.length > 0) {
      return {
        success: false,
        error: `Undefined variable(s): ${undefinedVars.join(', ')}`
      };
    }

    // Replace variables with their values
    let processedFormula = formula.replace(varRegex, (match) => {
      return String(numericVars[match]);
    });

    // Create a function with Math functions available
    const evalFunction = new Function(
      'Math', 'abs', 'min', 'max', 'floor', 'ceil', 'round', 'sqrt', 'pow',
      `'use strict'; return (${processedFormula});`
    );

    const result = evalFunction(
      Math, Math.abs, Math.min, Math.max, Math.floor, Math.ceil, Math.round, Math.sqrt, Math.pow
    );

    if (typeof result !== 'number' || isNaN(result)) {
      return {
        success: false,
        error: 'Formula did not produce a valid number'
      };
    }

    return {
      success: true,
      value: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid formula syntax'
    };
  }
}
