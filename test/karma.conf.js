module.exports = function(config) {
	config.set({
		frameworks: ['mocha', 'chai-sinon'],
		reporters: ['mocha'],
		browsers: ['PhantomJS'],

		files: [
			{ pattern: __dirname+'/**/*.js', watched: false, included: true, served: true }
		],

		preprocessors: {
			'**/*': ['webpack', 'sourcemap']
		},

		webpack: {
			module: {
				loaders: [
					{
						test: /\.jsx?$/,
						exclude: /node_modules/,
						loader: 'babel-loader',
						query: {
							presets: [
								'es2015'
							],
							plugins: [
								['transform-object-rest-spread'],
								['transform-react-jsx', { pragma: 'h' }]
							]
						}
					},
					{
						test: /\.css$/,
						loader: 'style-loader!css-loader'
					}
				]
			},
			resolve: {
				alias: {
					'preact-richtextarea': __dirname+'/../src/index.js',
					src: __dirname+'/../src'
				}
			}
		},

		webpackMiddleware: {
			noInfo: true
		}
	});
};