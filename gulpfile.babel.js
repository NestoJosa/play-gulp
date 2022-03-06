import gulp from 'gulp';
import del from 'del';
 
 
/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del([ 'dist' ]);
 
