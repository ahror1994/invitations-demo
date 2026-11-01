import {useMemo} from 'react';
export function routeLocation(){const route=location.hash.slice(1);return route.startsWith('/')?route:'/';}
export function projectLink(id:string,token:string){return location.origin+import.meta.env.BASE_URL+'#/manage/'+id+'?token='+encodeURIComponent(token);}
export function useRouter(){return useMemo(()=>({push:(url:string)=>{location.hash=url;},replace:(url:string)=>{history.replaceState(null,'',location.pathname+location.search+'#'+url);dispatchEvent(new HashChangeEvent('hashchange'));}}),[]);}
