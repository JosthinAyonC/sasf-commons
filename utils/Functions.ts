export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const toPascalCase = (str: string): string => {
  return str
    .replace(/[-_]/g, ' ')
    .split(' ') // Divide en palabras
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

// Convertir a camelCase
export const toCamelCase = (str: string): string => {
  const pascalCase = toPascalCase(str);
  return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
};

// Convertir a kebab-case
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

// Convertir a snake_case
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};
