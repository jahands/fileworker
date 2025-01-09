// @ts-check

const codeImports = [
	// Groups
	'<BUILTIN_MODULES>',
	'<THIRD_PARTY_MODULES>',
	'',
	'^(@repo)(/.*)$', // Workspace imports
	'',
	// Local (relative) imports
	'^[.]{2}$', // ..
	'^[.]{2}/', // ../
	'^[.]/(?!index)', // ./foo (but not ./index)
	'^[.]$', // .
	'^[.]/index$', // ./index
	'',
]

// Type imports are ordered the same way, but without separators.
// We also need a catch-all <TYPES> here to prevent prettier from failing.
const typeImports = ['<TYPES>'].concat(
	codeImports.filter((i) => i !== '').map((i) => `<TYPES>${i}`),
)

/** @type {import("prettier").Config} */
const config = {
	trailingComma: 'all',
	tabWidth: 2,
	useTabs: true,
	semi: false,
	singleQuote: true,
	printWidth: 100,
	htmlWhitespaceSensitivity: 'ignore',
	plugins: [
		'@ianvs/prettier-plugin-sort-imports',
		'prettier-plugin-multiline-arrays',
	],
	importOrder: [
		...codeImports,
		...typeImports,
	],
	importOrderTypeScriptVersion: '5.5.4',
	overrides: [
		{
			files: '*.jsonc',
			options: {
				trailingComma: 'none',
			},
		},
		{
			files: 'package.json',
			options: {
				useTabs: false,
			},
		},
	],
}

module.exports = config
