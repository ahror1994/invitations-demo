import {NextResponse} from 'next/server';
import {getCatalog,saveTemplate} from '@/lib/template-store';
import {isAdmin} from '@/lib/admin';
import {checkOrigin,errorResponse} from '@/lib/http';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:Request){const manage=new URL(req.url).searchParams.get('admin')==='1';if(manage&&!isAdmin(req))return NextResponse.json({error:'Доступ администратора необходим'},{status:403});try{const all=await getCatalog();return NextResponse.json(all.filter(t=>manage||t.published),{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'Не удалось открыть каталог'},{status:500});}}
export async function POST(req:Request){if(!isAdmin(req))return NextResponse.json({error:'Загрузка доступна только администратору'},{status:403});try{checkOrigin(req);if(Number(req.headers.get('content-length')||0)>32768)throw new Error('Слишком большой запрос');const entry=await saveTemplate(await req.json());return NextResponse.json(entry);}catch(e){return errorResponse(e);}}
