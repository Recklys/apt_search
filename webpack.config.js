var path = require('path'),
	webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	module: {
		rules: [{
		    test: /\.sass$/,
		    use: ["style-loader", "css-loader", "sass-loader"]
		}, {
			test: /\.gif$/,
			use: [{
				loader: 'file-loader',
				options: {
					outputPath: 'assets/img/'
				}
			}]
		}]
	},
	output: {
		filename: './assets/bundle.js'
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			_: 'underscore',
			Highcharts: 'highcharts'
		})
	],
	resolve: {
		modules: ['node_modules', path.resolve(__dirname, 'src'), path.resolve(__dirname, 'lib')]
	}
}
