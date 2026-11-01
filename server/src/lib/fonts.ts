import rawCatalog from './font-catalog.json';
export type FontWeight=400|700;
export type FontCategory='serif'|'sans'|'hand'|'display'|'mono';
export type FontSpec={id:string;name:string;category:FontCategory;coverage:number[][];source:string;license:string;sha256:Record<string,string>};
export const fontCatalog=rawCatalog as FontSpec[];
export const fontMap=new Map(fontCatalog.map(f=>[f.id,f]));
export const fontCategories={serif:'Классические',sans:'Современные',hand:'Рукописные',display:'Акцентные',mono:'Моноширинные'};
export function fontFamily(id:string,weight:FontWeight=400){return `IF-${id}-${weight}`;}
export function fontUrl(id:string,weight:FontWeight=400){if(!fontMap.has(id))throw new Error('Неизвестный шрифт');return `/fonts/library/${id}/${weight}.ttf`;}
export function fontSupportsText(id:string,text:string){const f=fontMap.get(id);if(!f)return false;return Array.from(text.normalize('NFC')).every(c=>{if(!/[\p{L}\p{M}\p{N}]/u.test(c))return true;const cp=c.codePointAt(0)!;let lo=0,hi=f.coverage.length-1;while(lo<=hi){const mid=(lo+hi)>>1;const [start,end]=f.coverage[mid];if(cp<start)hi=mid-1;else if(cp>end)lo=mid+1;else return true;}return false;});}
export function resolvedFont(id:string,text:string){return fontSupportsText(id,text)?id:'notosans';}
