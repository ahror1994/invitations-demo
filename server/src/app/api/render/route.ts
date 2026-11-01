import {eventSchema,formats,getFormat} from '@/lib/model';
import {renderInvitation} from '@/lib/render';
import {checkOrigin,errorResponse} from '@/lib/http';
import {PDFDocument} from 'pdf-lib';
import JSZip from 'jszip';
export const runtime='nodejs';
export async function POST(req:Request){try{checkOrigin(req);const raw=await req.json();const event=eventSchema.parse(raw.event);const kind=raw.kind??'png';if(!['png','pdf','zip'].includes(kind))throw new Error('Неизвестный формат');const guest=event.guests.find(g=>g.id===raw.guestId)??event.guests[0];const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
 if(kind==='png')return new Response(new Uint8Array(await renderInvitation(event,guest)),{headers:{...headers,'Content-Type':'image/png','Content-Disposition':'attachment; filename="invitation.png"'}});
 const blanks=Number(raw.blanks??0);if(!Number.isInteger(blanks)||blanks<0||blanks>50)throw new Error('Число пустых бланков: от 0 до 50');
 if(kind==='zip'){const zip=new JSZip();for(let i=0;i<event.guests.length;i++){const g=event.guests[i];const name=g.name.replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').slice(0,60);zip.file(`${String(i+1).padStart(3,'0')}_${name}.png`,await renderInvitation(event,g));}return new Response(new Uint8Array(await zip.generateAsync({type:'uint8array',compression:'STORE'})),{headers:{...headers,'Content-Type':'application/zip','Content-Disposition':'attachment; filename="invitations.zip"'}});}
 const pdf=await PDFDocument.create();const mm=72/25.4;const f=getFormat(event);const size:[number,number]=[f.mm[0]*mm,f.mm[1]*mm];pdf.setTitle(event.title);pdf.setCreator('Invitations');for(let i=0;i<event.guests.length+blanks;i++){const png=await pdf.embedPng(await renderInvitation(event,event.guests[i]??guest,i>=event.guests.length));const page=pdf.addPage(size);page.drawImage(png,{x:0,y:0,width:size[0],height:size[1]});}return new Response(new Uint8Array(await pdf.save()),{headers:{...headers,'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="invitations.pdf"'}});
 }catch(e){return errorResponse(e);}}
