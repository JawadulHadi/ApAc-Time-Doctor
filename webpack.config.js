import { resolve as _resolve } from 'path';

export const entry = './src/main.ts';
export const target = 'node';
export const mode = 'development';
export const module = {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
    ],
};
export const resolve = {
    extensions: ['.tsx', '.ts', ''],
};
export const output = {
    filename: 'main',
    path: _resolve(__dirname, 'dist'),
};
