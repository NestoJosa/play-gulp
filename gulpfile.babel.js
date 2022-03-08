import { src, dest, watch, series, parallel } from 'gulp';
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
import browserSync from "browser-sync";

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

// Refreshing the browser with Browsersync
const server = browserSync.create();

export const serve = done => {
	server.init({
		// put your local website link here:
		proxy: "http://localhost:8888/play-gulp/dist/index.html" 
	});
	done();
};

export const reload = done => {
	server.reload();
	done();
};

export const watchForChanges = () => {
	watch('src/scss/**/*.scss', series(compileStyles, reload));
	watch('src/js/**/*.js', series(compileScripts, reload));
	watch(['src/**/*','!src/{scss,js,}','!src/{scss,js}/**/*'], series(copy, reload));
	watch('**/*.php', reload); 
	watch('**/*.html', reload); 
}

export const dev = series(clean, parallel(compileStyles, compileScripts, copy), serve, watchForChanges);
export const build = series(clean, parallel(compileStyles, compileScripts, copy));
export default dev;