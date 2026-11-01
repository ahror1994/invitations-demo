import {useEffect,useRef,useState} from 'react';

// Progressive enhancement: the existing CSS envelope remains usable if WebGL fails.
export default function Envelope3D({title, label, preview=false}:{title:string;label:string;preview?:boolean}){
 const mount=useRef<HTMLSpanElement>(null),[ready,setReady]=useState(false);
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let stopped=false, frame=0, cleanup=()=>{};
  (async()=>{try{
   const T=await import('three'); if(stopped||!mount.current)return;
   const host=mount.current, scene=new T.Scene();
   const camera=new T.PerspectiveCamera(32,1,.1,40); camera.position.set(0,.2,6.5); camera.lookAt(0,0,0);
   const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)); renderer.setClearColor(0,0); renderer.outputColorSpace=T.SRGBColorSpace;
   renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap; host.appendChild(renderer.domElement);
   scene.add(new T.AmbientLight(0xffffff,.75));
   const light=new T.DirectionalLight(0xffe9cf,1.65);light.position.set(-3,5,6);light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.bias=-.0002;scene.add(light);
   const rim=new T.DirectionalLight(0xffffff,.65);rim.position.set(5,-1,4);scene.add(rim);
   const group=new T.Group();scene.add(group);
      const grain=document.createElement('canvas');grain.width=256;grain.height=256;const g=grain.getContext('2d')!;g.fillStyle='#e4e0d7';g.fillRect(0,0,256,256);
   for(let i=0;i<8000;i++){const v=200+Math.random()*45;g.fillStyle=`rgba(${v},${v},${v},.15)`;g.fillRect(Math.random()*256,Math.random()*256,1,1)}
   const bump=new T.CanvasTexture(grain);bump.wrapS=bump.wrapT=T.RepeatWrapping;bump.repeat.set(2,2);
   const cotton=new T.TextureLoader().load('/invitations-demo/brand/cotton-paper.webp');cotton.colorSpace=T.SRGBColorSpace;cotton.wrapS=cotton.wrapT=T.RepeatWrapping;
   const paper=new T.MeshStandardMaterial({color:0xe9dfcf,map:cotton,roughness:.95,bumpMap:bump,bumpScale:.025,side:T.DoubleSide});
   const front=new T.MeshStandardMaterial({color:0xf5eee3,map:cotton,roughness:.96,bumpMap:bump,bumpScale:.025,side:T.DoubleSide});
   const shaded=new T.MeshStandardMaterial({color:0xd8cab5,map:cotton,roughness:1,bumpMap:bump,bumpScale:.02,side:T.DoubleSide});
   function plate(w:number,h:number,depth:number,mat:any,x:number,y:number,z:number){const m=new T.Mesh(new T.BoxGeometry(w,h,depth),mat);m.position.set(x,y,z);group.add(m);return m;}
   function tri(points:number[][],mat:any){const sh=new T.Shape();sh.moveTo(points[0][0],points[0][1]);points.slice(1).forEach(p=>sh.lineTo(p[0],p[1]));sh.closePath();return new T.Mesh(new T.ShapeGeometry(sh),mat);}
   plate(3.4,2.16,.045,paper,0,0,0);
   // Canvas texture gives the paper card real depth while preserving personalised text.
   const c=document.createElement('canvas');c.width=960;c.height=640;const ctx=c.getContext('2d')!;
   ctx.fillStyle='#faf6ee';ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle='#c4b79e';ctx.lineWidth=2;ctx.strokeRect(36,36,888,568);
   ctx.fillStyle='#6d6456';ctx.textAlign='center';ctx.font='24px Georgia';ctx.fillText(label,480,210,750);ctx.font='52px Georgia';ctx.fillText(title,480,325,760);
   const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
   const card=plate(2.87,1.91,.035,new T.MeshStandardMaterial({map:texture,roughness:1}),0,.05,.065);
   const left=tri([[-1.7,-1.08],[-1.7,1.08],[0,-.02]],front);left.position.z=.11;group.add(left);
   const right=tri([[1.7,-1.08],[1.7,1.08],[0,-.02]],front);right.position.z=.115;group.add(right);
   const bottom=tri([[-1.7,-1.08],[1.7,-1.08],[0,.15]],shaded);bottom.position.z=.13;group.add(bottom);
   const hinge=new T.Group();hinge.position.set(0,1.08,.15);group.add(hinge);
   const flap=tri([[-1.7,0],[1.7,0],[0,-1.15]],paper);hinge.add(flap);
   const seal=new T.Mesh(new T.CylinderGeometry(.21,.21,.065,48),new T.MeshStandardMaterial({color:0x7b6249,roughness:.53,metalness:.18}));seal.rotation.x=Math.PI/2;seal.position.set(0,-.12,.19);group.add(seal);
      const sealPhoto=new T.TextureLoader().load('/invitations-demo/brand/envelope-paper.webp');sealPhoto.colorSpace=T.SRGBColorSpace;
   const skinMat=new T.MeshStandardMaterial({map:sealPhoto,roughness:.96,transparent:true,depthWrite:false});
   const skin=new T.Mesh(new T.PlaneGeometry(3.4,2.16),skinMat);skin.position.z=.27;group.add(skin);
   const mark=new T.Mesh(new T.TorusGeometry(.12,.008,8,48),new T.MeshStandardMaterial({color:0xd6bd8a,metalness:.4,roughness:.5}));mark.position.set(0,-.12,.23);group.add(mark);
   group.traverse((o:any)=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
   function resize(){const r=host.getBoundingClientRect();if(!r.width||!r.height)return;camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false);renderer.render(scene,camera)}
   const ro=new ResizeObserver(resize);ro.observe(host);resize();setReady(true);
   const start=performance.now();function animate(t:number){if(stopped)return;const seconds=(t-start)/1000;const opening=preview?0:Math.min(1,Math.max(0,(seconds-.55)/1.15));skinMat.opacity=preview?1:Math.max(0,1-(seconds-.55)/.45);const ease=opening*opening*(3-2*opening);hinge.rotation.x=-Math.PI*.93*ease;card.position.y=.05+(preview?0:Math.min(1,Math.max(0,(seconds-1.35)/1.1)))*.72;seal.scale.setScalar(Math.max(.001,1-ease));group.rotation.y=-.30+Math.sin(seconds*.8)*.06;group.rotation.x=.18;group.rotation.z=-.055;renderer.render(scene,camera);if(seconds<4)frame=requestAnimationFrame(animate)} frame=requestAnimationFrame(animate);
   cleanup=()=>{cancelAnimationFrame(frame);ro.disconnect();scene.traverse((o:any)=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach((m:any)=>m.dispose())}});texture.dispose();cotton.dispose();sealPhoto.dispose();bump.dispose();renderer.dispose();renderer.domElement.remove()};
  }catch{setReady(false)}})();
  return()=>{stopped=true;cleanup()};
 },[title,label,preview]);
 return <span ref={mount} aria-hidden="true" className={'wi-3d '+(ready?'is-ready':'')}/>;
}
