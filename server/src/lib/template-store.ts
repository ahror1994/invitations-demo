import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {formats} from './model';
import {catalogTemplateSchema,type CatalogTemplate} from './templates';
const file=path.join(process.cwd(),'data/templates.json');let queue:Promise<unknown>=Promise.resolve();
export async function getCatalog():Promise<CatalogTemplate[]>{try{return JSON.parse(await readFile(file,'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return [];throw e;}}
export function saveTemplate(input:unknown){const task=queue.catch(()=>{}).then(async()=>{const t=catalogTemplateSchema.parse(input);for(const [key,v] of Object.entries(t.variants)){if(!v)continue;const b=await readFile(path.join(process.cwd(),'data/uploads',v.backgroundId+'.png')).catch(()=>{throw new Error('Не найден файл фона. Загрузите его еще раз.');});const w=b.readUInt32BE(16),h=b.readUInt32BE(20),f=formats[key as keyof typeof formats];if(Math.abs(w/h-f.width/f.height)/(f.width/f.height)>.005)throw new Error(`Для ${f.ratio} нужен отдельный фон соответствующих пропорций. Загружено ${w}×${h}. Фон не будет обрезан автоматически.`);}const all=await getCatalog();const entry={...t,id:t.id||randomUUID()} as CatalogTemplate;const next=all.filter(v=>v.id!==entry.id).concat(entry);await mkdir(path.dirname(file),{recursive:true});const tmp=file+'.'+randomUUID()+'.tmp';await writeFile(tmp,JSON.stringify(next,null,2));await rename(tmp,file);return entry;});queue=task;return task;}
