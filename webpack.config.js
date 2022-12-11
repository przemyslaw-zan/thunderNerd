'use strict';

const path = require( 'path' );

const CleanTerminalPlugin = require( 'clean-terminal-webpack-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
	mode: 'development',
	entry: [
		'./src/script.mjs',
		'./src/styles.css'
	],
	output: {
		filename: 'main.[chunkhash].js',
		path: path.resolve( __dirname, 'dist' )
	},
	devServer: {
		hot: false,
		open: true,
		host: 'localhost'
	},
	plugins: [
		new CleanTerminalPlugin( { beforeCompile: true } ),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin( { template: 'src/index.html' } ),
		new MiniCssExtractPlugin( { filename: 'main.[chunkhash].css' } )
	],
	optimization: {
		minimizer: [
			'...',
			new CssMinimizerPlugin()
		]
	},
	module: {
		rules: [
			{
				test: /\.mjs$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ]
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [ 'postcss-preset-env' ]
							}
						}
					}
				]
			}
		]
	}
};
