const urls=new Map<string,string>();
export function assetUrl(id:string){return urls.get(id)||'';}
export function registerAsset(id:string,blob:Blob){const old=urls.get(id);if(old)URL.revokeObjectURL(old);urls.set(id,URL.createObjectURL(blob));}
