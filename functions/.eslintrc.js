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
  },
};