import { src, dest, series } from 'gulp';
import del from 'del';
import sourcemaps from 'gulp-sourcemaps';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
// Set dertSass as the default compiler for gulpSass
const sass = gulpSass( dartSass );
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import cleanCss from 'gulp-clean-css';
import webpack from 'webpack-stream';

// const PRODUCTION = yargs.argv.prod;
const PRODUCTION = true;

// Delete '/dist'
export const clean = () => del([ 'dist' ]);

// Copy files into '/dist'
export const copy = () => {
    return src([
        // Copy everything from src,
        'src/**/*',
        // except for certain dirs,
        '!src/{js,scss}',
        // and their content
        '!src/{js,scss}/**/*',
    ])
    // into a specified directory
    .pipe(dest('dist'));
}

// Compile sass to css
export const compileStyles = () => {
    // Take a bundle
    return src('src/scss/bundle.scss')
    .pipe(sourcemaps.init())
        // compile form sass to css and log any errors
        .pipe(sass.sync().on('error', sass.logError))
        // add vendor profixes
        .pipe(postcss([ autoprefixer ]))
        // minify the file
        // .pipe(cleanCss({compatibility:'ie8'}))
    .pipe(sourcemaps.write())
    // and pipe to dist
    .pipe(dest('dist/css'));
}

export const compileScripts = () => {
	return src('src/js/bundle.js')
	.pipe(webpack({
		module: {
            rules: [{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {presets: []}
                }
            }]
        },
        mode: PRODUCTION ? 'production' : 'development',
        devtool: !PRODUCTION ? 'inline-source-map' : false,
        output: {
            filename: 'bundle.js'
		},
	}))
	.pipe(dest('dist/js'));
}

export const dev = series(clean, copy, compileStyles);

// Set a default export that can be run with 'gulp'
export default dev;