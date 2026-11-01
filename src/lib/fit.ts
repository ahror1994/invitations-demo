export type FitResult={lines:string[];fontSize:number;lineHeight:number};
export function fitText(text:string,maxWidth:number,maxHeight:number,maxSize:number,minSize:number,measure:(text:string,size:number)=>number,maxLines=2):FitResult{
 if(!text.trim())return {lines:[],fontSize:maxSize,lineHeight:maxSize*1.3};
 for(let size=maxSize;size>=minSize;size--){const lh=size*1.3;const paragraphs=text.trim().split('\n');let lines:string[]=[];
  for(const p of paragraphs){let line='';for(const word of p.split(/\s+/)){const next=line?line+' '+word:word;if(measure(next,size)>maxWidth&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);}
  if(lines.length===2&&paragraphs.length===1){const words=text.trim().split(/\s+/);let best=Infinity;for(let i=1;i<words.length;i++){const a=words.slice(0,i).join(' '),b=words.slice(i).join(' '),wa=measure(a,size),wb=measure(b,size);if(wa<=maxWidth&&wb<=maxWidth&&Math.abs(wa-wb)<best){best=Math.abs(wa-wb);lines=[a,b];}}}
  if(lines.length<=maxLines&&lines.length*lh<=maxHeight&&lines.every(v=>measure(v,size)<=maxWidth))return {lines,fontSize:size,lineHeight:lh};
 }
 throw new Error('Текст не помещается. Сократите его или увеличьте текстовую зону в настройках оформления.');
}
