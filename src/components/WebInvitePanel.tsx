import {useState} from 'react';
import {type Draft,type Guest} from '../lib/model';
import {makeWebInvite,webInviteLink,type WebTheme} from '../lib/web-invite';

export default function WebInvitePanel({event,guest}:{event:Draft;guest:Guest}){
 const [theme,setTheme]=useState<WebTheme>('classic'),[status,setStatus]=useState('');
 const valid=!!event.title.trim()&&!!guest.name.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(event.date)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time);
 const url=valid?webInviteLink(makeWebInvite(event,guest,theme)):'';
 const messages={ru:`${guest.name}, приглашаем вас на ${event.title}! Откройте ваше персональное приглашение:`,ky:`${guest.name}, сизди ${event.title} майрамына чакырабыз! Жеке чакырууңузду ачыңыз:`,uz:`${guest.name}, sizni ${event.title} tadbiriga taklif qilamiz! Shaxsiy taklifnomangizni oching:`,en:`${guest.name}, you are invited to ${event.title}! Open your personal invitation:`};
 const shareLead=messages[guest.language]||messages.ru;
 const shareText=`${shareLead} ${url}`;
 async function copy(value:string,what:string){try{await navigator.clipboard.writeText(value);setStatus(`${what} скопировано. Вставьте в WhatsApp, Telegram, Instagram или другой чат.`)}catch{setStatus('Не удалось скопировать автоматически. Выделите ссылку в поле ниже и скопируйте её вручную.')}}
 async function share(){try{await navigator.share({title:'Приглашение',text:shareText});setStatus('Выберите приложение и отправьте приглашение гостю.')}catch(e){if((e as Error).name!=='AbortError')setStatus('Не удалось открыть меню. Скопируйте ссылку или выберите мессенджер.')}}
 return <section className="web-panel" aria-label="Интерактивное приглашение">
  <p className="web-panel-eyebrow">ПЕРСОНАЛЬНАЯ ССЫЛКА</p><h3>Приглашение-сайт</h3>
  <p>Гость откроет конверт и увидит страницу с деталями события, картой и обратным отсчётом.</p>
  <label className="tool-field">Оформление сайта<select value={theme} onChange={e=>{setTheme(e.target.value as WebTheme);setStatus('')}}><option value="classic">Классика · тёплый беж</option><option value="garden">Сад · шалфей</option><option value="night">Вечер · тёмная зелень</option></select></label>
  <p className="hint">Оформление сайта выбирается отдельно от картинки для печати. Свой фон и настройки карточки на сайт пока не переносятся.</p>
  {url?<>
   <a className="web-preview" href={url} target="_blank" rel="noopener noreferrer">Посмотреть приглашение для {guest.name} ↗</a>
   <button className="primary full" onClick={()=>copy(url,'Ссылка')}>Скопировать ссылку</button>
   <div className="web-share-links"><a href={'https://wa.me/?text='+encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><a href={'https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(shareLead)} target="_blank" rel="noopener noreferrer">Telegram ↗</a></div>
   {typeof navigator.share==='function'&&<button className="secondary full" onClick={share}>Другие приложения ↗</button>}
   <button className="secondary full" onClick={()=>copy(shareText,'Сообщение')}>Скопировать сообщение со ссылкой</button>
   <p className="web-share-note">Для Instagram и других чатов скопируйте ссылку или сообщение и вставьте в переписку.</p>
   <label className="web-link-label">Ссылка для гостя<textarea readOnly value={url} onFocus={e=>e.currentTarget.select()} rows={2}/></label>
   {url.length>3000&&<p className="notice error">Ссылка очень длинная — некоторые мессенджеры могут её обрезать. Сократите текст приглашения.</p>}
  </>:<p className="hint">Чтобы подготовить сайт, заполните название события, дату, время и имя гостя.</p>}
  {status&&<p className="notice success" role="status">{status}</p>}
  <p className="web-privacy">Демо без сервера: текст и имя гостя содержатся в ссылке. Любой, у кого она есть, сможет их прочитать и переслать. Не добавляйте конфиденциальные данные. Подтверждения гостей пока не собираются.</p>
 </section>;
}