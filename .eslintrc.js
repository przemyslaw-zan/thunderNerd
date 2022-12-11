'use strict';

module.exports = {
	root: true,
	extends: 'ckeditor5',
	env: {
		node: true,
		browser: false,
		es2021: true
	},
	parserOptions: {
		sourceType: 'script'
	},
	overrides: [
		{
			files: [ './src/**' ],
			env: {
				node: false,
				browser: true
			},
			parserOptions: {
				sourceType: 'module'
			}
		}
	],
	rules: {
		'no-multiple-empty-lines': [ 'error', { max: 2, maxEOF: 0 } ],
		'strict': [ 'error', 'global' ]
	}
};
