import path from 'path';
import fs from 'fs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import discardComments from 'postcss-discard-comments';

let pkg = JSON.parse(fs.readFileSync('./package.json'));

let external = Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}));

export default {
	entry: 'src/index.js',
	dest: pkg.main,
	sourceMap: path.resolve(pkg.main),
	moduleName: pkg.amdName,
	format: 'umd',
	external,
	plugins: [
		babel({
			babelrc: false,
			comments: false,
			exclude: ['node_modules/**', '**/*.css'],
			presets: ['es2015-rollup'],
			plugins: [
				['transform-es2015-classes', { loose:true }],
				['transform-object-rest-spread'],
				['transform-react-jsx', { pragma: 'h' }]
			]
		}),
		postcss({
			plugins: [
				discardComments({ removeAll: true })
			]
		})
	]
};
