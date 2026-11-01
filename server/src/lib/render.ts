import {createCanvas,GlobalFonts,loadImage} from '@napi-rs/canvas';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {type EventData,type Guest,formats,getFormat} from './model';
import {drawInvitation,requiredFonts} from './draw';
import {fontFamily,type FontWeight} from './fonts';
const registered=new Set<string>();
export function registerFont(id:string,weight:FontWeight){const family=fontFamily(id,weight);if(registered.has(family))return;if(!GlobalFonts.registerFromPath(path.join(process.cwd(),'public/fonts/library',id,weight+'.ttf'),family))throw new Error('Не удалось загрузить шрифт '+id);registered.add(family);}
let ready=false;
function init(){if(ready)return;for(const [file,family] of [['NotoSans-Regular.ttf','Invitation Sans'],['NotoSerif-Regular.ttf','Invitation Serif']])if(!GlobalFonts.registerFromPath(path.join(process.cwd(),'public/fonts',file),family))throw new Error('Не удалось загрузить шрифт');ready=true;}
const cache=new Map<string,Buffer>();
export function renderKey(e:EventData,g:Guest,blank=false){return createHash('sha256').update(JSON.stringify({v:6,event:{...e,guests:undefined},g,blank})).digest('hex');}
export async function renderInvitation(e:EventData,g:Guest,blank=false):Promise<Buffer>{init();for(const font of requiredFonts(e,g))registerFont(font.id,font.weight);const key=renderKey(e,g,blank);if(cache.has(key))return cache.get(key)!;const {width,height}=getFormat(e);const canvas=createCanvas(width,height);let background;
 if(e.template==='floral')background=await loadImage(path.join(process.cwd(),'public/designs',e.format==='story'?'floral-story.jpg':e.format==='portrait'?'floral-portrait.jpg':'floral.jpg'));
 if(e.template==='custom'&&e.backgroundId){if(!/^[a-f0-9-]{36}$/.test(e.backgroundId))throw new Error('Некорректный фон');background=await loadImage(path.join(process.cwd(),'data/uploads',e.backgroundId+'.png'));}
 drawInvitation(canvas.getContext('2d') as unknown as CanvasRenderingContext2D,e,g,{blank,background:background as unknown as CanvasImageSource});const out=canvas.toBuffer('image/png');if(cache.size>=24)cache.delete(cache.keys().next().value!);cache.set(key,out);return out;}
