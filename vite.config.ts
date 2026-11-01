import {defineConfig} from 'vite';import path from 'node:path';
export default defineConfig({base:'/invitations-demo/',resolve:{alias:{'@':path.resolve(import.meta.dirname,'src'),'next/navigation':path.resolve(import.meta.dirname,'src/navigation.ts')}},esbuild:{jsx:'automatic'},build:{outDir:'docs',emptyOutDir:true},server:{host:'127.0.0.1',port:4173},preview:{host:'127.0.0.1',port:4173}});
