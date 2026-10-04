import vue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
export default [
  { ignores: ['**/node_modules/**', '**/.temp/**', '**/.cache/**', '**/dist/**'] },
  ...vue.configs['flat/essential'],
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: ts.parser, extraFileExtensions: ['.vue'] } } },
  { files: ['**/*.ts'], languageOptions: { parser: ts.parser } },
]
