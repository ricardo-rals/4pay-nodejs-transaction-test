module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // Erro ao usar `console.log`
    'no-console': 'warn',

    // Impede o uso de `any`
    '@typescript-eslint/no-explicit-any': 'error',

    // Requer que funções assíncronas retornem uma Promise corretamente
    '@typescript-eslint/explicit-module-boundary-types': 'warn',

    // Obriga o uso de `const` quando a variável não é reatribuída
    'prefer-const': 'error',

    // Exige que todas as variáveis usadas sejam declaradas
    'no-undef': 'error',

    // Proíbe variáveis declaradas e não utilizadas
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // Impede o uso de funções vazias
    'no-empty-function': 'warn',

    // Obriga o uso de ponto e vírgula
    'semi': ['error', 'always'],

    // Evita espaços extras no código
    'no-trailing-spaces': 'error',

    // Garante indentação consistente (2 espaços)
    'indent': ['error', 2],

    // Garante que as chaves fiquem no mesmo padrão
    'curly': 'error'
  }
};
