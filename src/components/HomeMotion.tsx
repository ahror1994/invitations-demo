'use client';
import {useEffect,useRef} from 'react';
const words=[['Свадьба','Алина & Тимур'],['Ваш день','Ваши близкие','Рядом'],['Кыз узатуу','Тёплые пожелания'],['День рождения','Повод собраться'],['Приглашение','С вашей историей'],['Азиз & Малика','Начало истории'],['Детский той','Большое счастье'],['Юбилей','В кругу близких'],['Встреча','Которую ждут'],['С любовью','Для вас']];
// Same pool size as the reference: ten slots, five images repeated twice.
const pictures=Array.from({length:10},(_,i)=>`/invitations-demo/motion-images/${String(i%5+1).padStart(2,'0')}.webp`);
export default function HomeMotion(){
 const trail=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const host=trail.current;if(!host)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  let last:{x:number;y:number}|null=null,cursor:{x:number;y:number}|null=null,cache={x:0,y:0},index=0,z=0,frame=0,alive=true;
  const pool=pictures.map(src=>{const card=document.createElement('img');card.src=src;card.alt='';card.className='cursor-memory';card.style.opacity='0';card.dataset.active='false';card.draggable=false;host.append(card);return card;});
  const active=new Set<HTMLElement>();
  const clear=()=>{for(const e of pool){e.getAnimations().forEach(a=>a.cancel());e.dataset.active='false';e.style.opacity='0';}active.clear();last=null;cursor=null;};
  const spawn=(x:number,y:number)=>{
   if(!pool.every(im=>im.complete&&im.naturalWidth>0))return;
   const card=pool[index++%pool.length];card.getAnimations().forEach(a=>a.cancel());active.delete(card);
   const blur=0;card.style.left=x+'px';card.style.top=y+'px';card.style.zIndex=String(++z);card.dataset.active='true';active.add(card);
   const finish=()=>{card.dataset.active='false';card.style.opacity='0';card.getAnimations().forEach(a=>a.cancel());active.delete(card);};
   const enter=card.animate([{opacity:0,transform:`translate(calc(-50% + ${cache.x-x}px),calc(-50% + ${cache.y-y}px)) scale(0)`,filter:'grayscale(1) blur(20px)'},{opacity:1,transform:'translate(-50%,-50%) scale(1.2)',filter:`grayscale(0) blur(${blur}px)`}],{duration:800,easing:'cubic-bezier(.215,.61,.355,1)',fill:'forwards'});
   enter.onfinish=()=>{if(!active.has(card))return;const exit=card.animate([{opacity:1,transform:'translate(-50%,-50%) scale(1.2)',filter:`grayscale(0) blur(${blur}px)`},{opacity:0,transform:'translate(-50%,-50%) scale(.8)',filter:'grayscale(1) blur(20px)'}],{duration:1200,easing:'cubic-bezier(.215,.61,.355,1)',fill:'forwards'});exit.onfinish=finish;};
  };
  const move=(e:PointerEvent)=>{if(reduced.matches||!fine.matches||e.pointerType==='touch'||document.hidden)return;const target=e.target as HTMLElement;if(target.closest('button,a,input,dialog')){cursor=null;last=null;return;}cursor={x:e.clientX,y:e.clientY};if(!last){last={...cursor};cache={...cursor};}};
  const tick=()=>{if(!alive)return;frame=requestAnimationFrame(tick);if(reduced.matches||!fine.matches||document.hidden){clear();return;}if(!cursor||!last)return;cache.x+=(cursor.x-cache.x)*.1;cache.y+=(cursor.y-cache.y)*.1;if(Math.hypot(cursor.x-last.x,cursor.y-last.y)>100){spawn(cursor.x,cursor.y);last={...cursor};}};
  frame=requestAnimationFrame(tick);window.addEventListener('pointermove',move,{passive:true});window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);reduced.addEventListener('change',clear);fine.addEventListener('change',clear);
  return()=>{alive=false;cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);reduced.removeEventListener('change',clear);fine.removeEventListener('change',clear);clear();pool.forEach(e=>e.remove());};
 },[]);
 return <><div className="home-whispers" aria-hidden="true"><div className="whispers-perspective"><div className="whispers-space">{words.map((lines,i)=><div key={i} className={'home-whisper whisper-'+i}><div className="whisper-inner">{lines.map((line,n)=>n===0?<strong key={n}>{line}</strong>:<span key={n}>{line}</span>)}</div></div>)}</div></div></div><div className="cursor-memories" ref={trail} aria-hidden="true"/></>;
}
