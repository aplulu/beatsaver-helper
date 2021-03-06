import webpack from 'webpack';
import path from 'path';
import WebpackCopyPlugin from 'copy-webpack-plugin';


const browser = process.env.BROWSER as string;
const env = (process.env.NODE_ENV || 'development') as string;

const config: webpack.Configuration = {
    devtool: env === 'development' ? 'inline-source-map' : false,

    context: path.resolve(__dirname, 'src'),

    entry: {
        'service_worker': './service_worker.ts',
        'scripts/content_script_beatsaver': './scripts/content_script_beatsaver.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist', browser, env),
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader' },
        ],
    },
    plugins: [
        new WebpackCopyPlugin({
            patterns: [{
                from: browser === 'firefox' ? 'manifest_v2.json' : 'manifest.json',
                to: './manifest.json',
            }]
        }),
    ]
};
export default config;