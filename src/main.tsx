import React,{useSyncExternalStore} from 'react';
import {createRoot} from 'react-dom/client';
import Builder from './components/Builder';
import WebInvite from './components/WebInvite';
import BrandBackdrop from './components/BrandBackdrop';
import {routeLocation} from './navigation';
import {initStaticApi} from './static-api';
import './app/globals.css';import './app/brand.css';import './app/moment-redesign.css';
const subscribe=(fn:()=>void)=>{window.addEventListener('hashchange',fn);return()=>window.removeEventListener('hashchange',fn);};
function App(){const route=useSyncExternalStore(subscribe,routeLocation),url=new URL(route,'https://demo.local'),manage=url.pathname.match(/^\/manage\/([a-f0-9-]+)$/),step=Number(url.searchParams.get('step')||0);if(url.pathname==='/invite')return <WebInvite key={route} encoded={url.searchParams.get('data')||''}/>;return <><BrandBackdrop/>{manage?<Builder key={manage[1]} projectId={manage[1]}/>:url.pathname==='/create'?<Builder key="editor" initialStep={Number.isInteger(step)&&step>=0&&step<=5?step:0}/>:<Builder key="home"/>}</>;}
const render=()=>createRoot(document.getElementById('root')!).render(<App/>);
if(routeLocation().startsWith('/invite?'))render();else initStaticApi().then(render).catch(()=>{document.getElementById('root')!.textContent='Не удалось открыть локальное хранилище демоверсии. Разрешите хранение данных для этого сайта и обновите страницу.';});
