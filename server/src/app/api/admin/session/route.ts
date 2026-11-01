import {NextResponse} from 'next/server';
import {adminCookie,validKey,makeAdminSession} from '@/lib/admin';
import {checkOrigin} from '@/lib/http';
export async function POST(req:Request){try{checkOrigin(req);if(Number(req.headers.get('content-length')||0)>1024)return NextResponse.json({error:'Неверный запрос'},{status:400});const {key}=await req.json();if(!validKey(key))return NextResponse.json({error:'Неверный ключ администратора'},{status:403});const r=NextResponse.json({ok:true});r.cookies.set(adminCookie,makeAdminSession(),{httpOnly:true,sameSite:'strict',secure:new URL(req.url).protocol==='https:',path:'/',maxAge:8*60*60});r.headers.set('Cache-Control','no-store');return r;}catch{return NextResponse.json({error:'Доступ запрещен'},{status:403});}}
export async function DELETE(){const r=NextResponse.json({ok:true});r.cookies.set(adminCookie,'',{path:'/',maxAge:0});return r;}
