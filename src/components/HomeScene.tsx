import {webInviteLink} from '../lib/web-invite';
import Envelope3D from './Envelope3D';
import '../app/home-editorial.css';
import '../app/web-invite.css';
export default function HomeScene({onBegin,hasDraft}:{onBegin:()=>void;hasDraft:boolean}){
 const demo=webInviteLink({v:1,theme:'garden',title:'Алина & Тимур',guest:'Дорогие гости',body:'Мы будем счастливы разделить с вами радость этого особенного дня.',date:'2027-09-18',time:'17:00',venue:'Сад у озера',city:'Бишкек',address:'',host:'Алина и Тимур'});
 return <main className="scene-home immersive-home">
  <header className="immersive-nav"><a href="#/" className="immersive-logo" aria-label="Moment — на главную">moment<span>✳</span></a><span className="immersive-note">ПРИГЛАШЕНИЯ ДЛЯ ВАЖНЫХ ДНЕЙ</span><button onClick={onBegin}>{hasDraft?'Продолжить':'Создать'} <span>↗</span></button></header>
  <section className="immersive-hero"><img className="immersive-photo" src="/invitations-demo/brand/editorial-garden.webp" alt=""/><div className="immersive-shade"/>
   <div className="immersive-copy"><p className="immersive-kicker">ЛИЧНЫЕ ПРИГЛАШЕНИЯ · MOMENT</p><h1>Событие<br/>начинается<br/><em>с приглашения.</em></h1><p className="immersive-intro">Создайте красивую историю для близких и отправьте её одной ссылкой.</p><div className="immersive-actions"><button onClick={onBegin}>{hasDraft?'Продолжить создание':'Создать приглашение'} <span>↗</span></button><a href={demo} target="_blank" rel="noopener noreferrer">Открыть пример <span>↗</span></a></div></div>
   <a className="immersive-object" href={demo} target="_blank" rel="noopener noreferrer" aria-label="Открыть пример приглашения"><div className="home-envelope"><Envelope3D title="Алина & Тимур" label="ПРИГЛАШЕНИЕ" preview/><div className="home-card-fallback"><small>ПРИГЛАШЕНИЕ</small><strong>Алина<br/>& Тимур</strong><small>18 СЕНТЯБРЯ 2027</small></div></div><span className="immersive-object-label">ПОСМОТРЕТЬ ИСТОРИЮ <b>↗</b></span></a>
   <div className="immersive-bottom"><span>ДЛЯ ДНЕЙ, КОТОРЫЕ ХОЧЕТСЯ РАЗДЕЛИТЬ</span><span>01 — MOMENT</span></div>
  </section>
  <section className="immersive-how"><div><span>01 / СОЗДАЙТЕ</span><p>Расскажите о вашем событии</p></div><div><span>02 / ВЫБЕРИТЕ</span><p>Придайте истории настроение</p></div><div><span>03 / ПОДЕЛИТЕСЬ</span><p>Пригласите тех, кто рядом</p></div></section>
 </main>;
}
