import { src, dest } from 'gulp';
import del from 'del';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
// Set dertSass as the default compiler for gulpSass
const sass = gulpSass( dartSass );
 
// Delete '/dist'
export const clean = () => del([ 'dist' ]);

// Copy source files into '/dist'
export const copy = () => {
    return src([
        // Copy everything from src,
        'src/**/*',
        // except for certain dirs,
        '!src/{js,scss}', 
    ])
    // into a specified directory
    .pipe(dest('dist'));
}

// Compile sass to css
export const compileStyles = () => {
    // Take a bundle
    return src('src/scss/bundle.scss')
    // compile form sass to css and log any errors
    .pipe(sass.sync().on('error', sass.logError))
    // and pipe to dist
    .pipe(dest('dist/css'));
}

// Set a default export that can be run with 'gulp'
export default compileStyles;