import {createHmac,timingSafeEqual} from 'node:crypto';
export const adminCookie='invitation-admin';
function digest(v:string){return createHmac('sha256',process.env.INVITATION_ADMIN_KEY||'unconfigured').update(v).digest();}
export function validKey(key:unknown){const expected=process.env.INVITATION_ADMIN_KEY;return Boolean(expected&&typeof key==='string'&&key.length<=256&&timingSafeEqual(digest(key),digest(expected)));}
export function makeAdminSession(){const expires=String(Date.now()+8*60*60*1000);return expires+'.'+digest(expires).toString('base64url');}
export function validAdminSession(value:string){if(!process.env.INVITATION_ADMIN_KEY)return false;const [expires,sig]=value.split('.');if(!/^\d{13}$/.test(expires)||Number(expires)<Date.now()||Number(expires)>Date.now()+9*60*60*1000)return false;const expected=digest(expires).toString('base64url');return Boolean(sig&&sig.length===expected.length&&timingSafeEqual(Buffer.from(sig),Buffer.from(expected)));}
export function isAdmin(req:Request){const pair=(req.headers.get('cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(adminCookie+'='));return validAdminSession(pair?.slice(adminCookie.length+1)||'');}
