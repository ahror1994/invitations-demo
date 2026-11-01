import {fontFamily,fontUrl,type FontWeight} from './fonts';
const pending=new Map<string,Promise<void>>();
export function loadLocalFont(id:string,weight:FontWeight=400):Promise<void>{const family=fontFamily(id,weight);if(!pending.has(family)){const task=new FontFace(family,`url("${fontUrl(id,weight)}")`,{weight:'400',style:'normal'}).load().then(face=>{document.fonts.add(face);}).catch(error=>{pending.delete(family);throw error;});pending.set(family,task);}return pending.get(family)!;}
