module.exports = {
	entry: {
		index: "./index.js",
		"task-list": "./task-list.js"
	},
	output: {
		path: "../src/main/resources/public/generated-bundle",
		filename: "[name].js"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style!css" },
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['react', 'es2015']
				}
			}
		]
	}
}