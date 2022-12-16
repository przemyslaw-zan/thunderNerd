'use strict';

module.exports = {
	root: true,
	extends: 'ckeditor5',
	ignorePatterns: [ 'dist' ],
	env: {
		node: true
	},
	parserOptions: {
		sourceType: 'script',
		ecmaVersion: 'latest'
	},
	overrides: [
		{
			files: [ './*/**' ],
			env: {
				node: false,
				browser: true
			},
			parserOptions: {
				sourceType: 'module'
			}
		},
		{
			files: [ './scripts/**' ],
			env: {
				node: true
			}
		}
	],
	rules: {
		'no-multiple-empty-lines': [ 'error', { max: 1, maxEOF: 0 } ],
		'strict': [ 'error', 'global' ]
	}
};
