import {readFile} from 'node:fs/promises';
import path from 'node:path';
export const runtime='nodejs';
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^[a-f0-9-]{36}$/.test(id))return new Response('Not found',{status:404});try{return new Response(new Uint8Array(await readFile(path.join(process.cwd(),'data/uploads',id+'.png'))),{headers:{'Content-Type':'image/png','Cache-Control':'private, max-age=86400','X-Content-Type-Options':'nosniff'}});}catch{return new Response('Not found',{status:404});}}
