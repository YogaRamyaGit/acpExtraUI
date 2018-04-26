import * as path from 'path';
import * as webpack from 'webpack';
import * as _ from 'lodash';
require('dotenv').load();

// for custom apis
import App from './server/app';

// Plugins
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin';

// Utils
let isProduction: boolean = false;
if (process.argv.indexOf('-p') >= 0) { // If production flag is passed
    isProduction = true;
    process.env.NODE_ENV = 'production';
}
const sourcePath: string = path.join(__dirname, './src');
const outPath: string = path.join(__dirname, './dist');

// Production Plugins
const plugins: webpack.Plugin[] = [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({
        filename: 'styles.css',
        disable: !isProduction
    }),
    new HtmlWebpackPlugin({
        title: 'Config Editor',
        disable: !isProduction
    })
];

if (!isProduction) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoErrorsPlugin());
} else {
    plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }));

    plugins.push(new UglifyJSPlugin({
        uglifyOptions: {
            ecma: 8
        }
    }));
}


// Config
const config: webpack.Configuration = {
    context: sourcePath,
    entry: {
        main: './index.tsx'
    },
    output: {
        path: outPath,
        publicPath: '/',
        filename: 'bundle.js',
    },
    target: 'web',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        // Fix webpack's default behavior to not load packages with jsnext:main module
        // https://github.com/Microsoft/TypeScript/issues/11677
        mainFields: ['main']
    },
    module: {
        loaders: [
            // .ts, .tsx
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    configFile: './tslint.json'
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            // css
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            // static assets
            { test: /\.html$/, loader: 'html-loader' },
            { test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader' }
        ],
    },
    plugins: plugins,
    devServer: {
        compress: true,
        contentBase: isProduction ? outPath : sourcePath,
        historyApiFallback: true,
        overlay: {
            warnings: false,
            errors: true
        },
        stats: 'normal',
        watchContentBase: true,
        disableHostCheck: true,
        before(app) {
            if (isProduction) {
                process.env.NODE_ENV = 'production';
            }

            const regApp = new App(app);

            regApp.registerApiLogger();
            regApp.registerAuthApis('123abc');
            regApp.registerConfigApis();
            regApp.registerWorkflowApis();
            regApp.registerErrorLogger();
        }
    },
    node: {
        // workaround for webpack-dev-server issue
        // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
        fs: 'empty',
        net: 'empty'
    }
};

export default config;
