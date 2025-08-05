module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
    "/generated/**/*",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": "off", // Desactivado - permite comillas simples y dobles
    "import/no-unresolved": 0,
    "indent": "off", // Desactivado - permite cualquier indentación
    "object-curly-spacing": "off", // Desactivado - permite espacios en objetos
    "require-jsdoc": "off", // Desactivado - no requiere JSDoc
    "eol-last": "off", // Desactivado - no requiere línea nueva al final
    "max-len": "off", // Desactivado - no limita longitud de línea
    "comma-dangle": "off", // Desactivado - permite comas finales o no
    "semi": "off", // Desactivado - permite punto y coma o no
    "space-before-function-paren": "off", // Desactivado - espacios antes de paréntesis
    "operator-linebreak": "off", // Desactivado - operadores en nueva línea
    "@typescript-eslint/no-inferrable-types": "off", // Permite anotaciones de tipo explícitas
    "no-trailing-spaces": "off", // Permite espacios al final de líneas
    "@typescript-eslint/no-namespace": "off", // Permite namespaces
    "arrow-parens": "off", // No requiere paréntesis en arrow functions
    "@typescript-eslint/no-extra-semi": "off", // Permite punto y coma innecesarios
    "padded-blocks": "off", // Permite bloques con líneas en blanco
    "new-cap": "off", // Permite funciones con mayúscula sin new
    "@typescript-eslint/no-var-requires": "off", // Permite require() en lugar de import
    "@typescript-eslint/no-explicit-any": "off", // Permite uso de 'any'
    "@typescript-eslint/no-empty-function": "off", // Permite funciones vacías
    "@typescript-eslint/no-unused-vars": "off", // Permite variables no usadas
    "brace-style": "off", // Permite diferentes estilos de llaves
    "block-spacing": "off", // Permite espacios en bloques
  },
};