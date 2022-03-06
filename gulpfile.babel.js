import { src, dest } from 'gulp';
import del from 'del';
 
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
    // compile form sass to css
    // and pipe to dist
}

// Set a default export that can be run with 'gulp'
export default copy;