import {webDesigns,type WebTheme} from '../lib/web-invite';
export default function WebDesignPicker({value,onChange}:{value:WebTheme;onChange:(theme:WebTheme)=>void}){
 return <fieldset className="web-design-picker"><legend>Оформление сайта-приглашения</legend><div className="web-design-grid">{webDesigns.map(([id,name,description])=><button type="button" key={id} className={'web-design-card web-design-'+id} aria-pressed={value===id} onClick={()=>onChange(id)}><span className="web-design-image" aria-hidden="true"><span>А &amp; Т</span></span><span className="web-design-meta"><strong>{name}</strong><small>{description}</small></span></button>)}</div></fieldset>;
}
