import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
export function checkOrigin(req:Request){
 const origin=req.headers.get('origin');
 const url=new URL(req.url);
 const expected=url.protocol+'//'+(req.headers.get('host')??url.host);
 if(origin && origin!==expected)throw new Error('Недопустимый источник запроса');
}
export function errorResponse(error:unknown){
 const message=error instanceof ZodError?'Проверьте данные: '+error.issues.map(i=>i.path.join('.')+': '+i.message).slice(0,3).join('; '):error instanceof Error?error.message:'Ошибка запроса';
 return NextResponse.json({error:message},{status:400});
}
