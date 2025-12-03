import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-syntax': [
        'error',

        {
          selector: 'TSEnumDeclaration',
          message:
            'Enums can cause bundle-size issues. Please use Literal Types. See: https://personal-site-lemon-eight.vercel.app/blog/typescript-enums/',
        },
      ],
      'no-unused-vars': 'off',

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'mbau',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'mbau',
          style: 'kebab-case',
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'no-public',
        },
      ],
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/triple-slash-reference': 'warn',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@angular/common',
              importNames: ['AsyncPipe', 'CommonModule'],
              message:
                'These imports from @angular/common have either impact on load time or runtime performance. Please consider using alternatives.',
            },
            {
              name: '@angular/common/http',
              importNames: ['HttpStatusCode'],
              message:
                'These imports from @angular/common/http have either impact on load time or runtime performance. Please consider using alternatives.',
            },
            {
              name: '@angular/core',
              importNames: ['HostListener'],
              message:
                'These imports from @angular/core have either impact on load time or runtime performance. Please consider using alternatives.',
            },
            {
              name: '@angular/router',
              importNames: ['RouterModule'],
              message:
                'Please import the directives or pipes directly instead of RouterModule to ensure treeshaking!',
            },
            {
              name: '@angular/forms',
              importNames: [
                'UntypedFormArray',
                'UntypedFormBuilder',
                'UntypedFormControl',
                'UntypedFormGroup',
              ],
              message:
                'Please use typed Reactive Forms to ensure type-safety and enforce strict typing Angular forms.',
            },
            {
              name: 'rxjs/operators',
              message:
                'Please import all Observable creation operators and pipe-able operators directly from the main rxjs entrypoint.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts', '**/test-setup.ts'],
    rules: {
      '@angular-eslint/sort-lifecycle-methods': 'error',
      '@angular-eslint/no-conflicting-lifecycle': 'error',
      '@angular-eslint/no-lifecycle-call': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/relative-url-prefix': 'error',
      '@angular-eslint/require-localize-metadata': [
        'error',
        {
          requireDescription: true,
          requireMeaning: true,
        },
      ],
      '@angular-eslint/use-pipe-transform-interface': 'error',
      '@angular-eslint/no-host-metadata-property': 'off',
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/button-has-type': 'error',
      '@angular-eslint/template/conditional-complexity': 'error',
      '@angular-eslint/template/cyclomatic-complexity': 'error',
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/no-inline-styles': [
        'error',
        {
          allowNgStyle: true,
          allowBindToStyle: true,
        },
      ],
      '@angular-eslint/template/no-interpolation-in-attributes': 'error',
      // We're still using `@rx-angular/template`. So this is better be explicitly off!
      '@angular-eslint/template/prefer-control-flow': 'off',
      '@angular-eslint/template/prefer-ngsrc': 'error',
      '@angular-eslint/template/use-track-by-function': 'error',

      // For a11y
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/elements-content': 'error',
      '@angular-eslint/template/label-has-associated-control': 'error',
      '@angular-eslint/template/mouse-events-have-key-events': 'error',
      '@angular-eslint/template/no-autofocus': 'error',
      '@angular-eslint/template/no-distracting-elements': 'error',
      '@angular-eslint/template/no-positive-tabindex': 'error',
      '@angular-eslint/template/role-has-required-aria': 'error',
      '@angular-eslint/template/table-scope': 'error',
      '@angular-eslint/template/valid-aria': 'error',
    },
  },
];
