module.exports = {
    root: true,
    env: {
        node: true,
        jquery: true,
        browser: true
    },
    extends: ['plugin:vue/recommended', '@vue/prettier', '@vue/typescript'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-console': 'off',
        'prefer-const': 'error',
        'vue/require-default-prop': 'off',
        'no-var': 'error',
        'vue/no-use-v-if-with-v-for': 'off',
        'vue/no-v-html': 'off'
    },
    parserOptions: {
        parser: '@typescript-eslint/parser'
    }
};
