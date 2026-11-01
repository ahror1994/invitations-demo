'use client';
import {create} from 'zustand';
import {persist,createJSONStorage} from 'zustand/middleware';
import {defaults,upgradeDraft,type Draft,type Guest} from './model';
type Saved={id:string;token:string;revision:number};
type Store={wizardStep:number;setWizardStep:(step:number)=>void;draft:Draft;saved:Saved|null;setEvent:(patch:Partial<Draft>)=>void;setSaved:(s:Saved|null)=>void;updateGuest:(id:string,p:Partial<Guest>)=>void;addGuests:(g:Guest[])=>void;removeGuest:(id:string)=>void;reset:()=>void};
export const useProject=create<Store>()(persist((set)=>({wizardStep:0,setWizardStep:wizardStep=>set({wizardStep}),draft:defaults,saved:null,setEvent:p=>set(s=>({draft:{...s.draft,...p}})),setSaved:saved=>set({saved}),updateGuest:(id,p)=>set(s=>({draft:{...s.draft,guests:s.draft.guests.map(g=>g.id===id?{...g,...p}:g)}})),addGuests:g=>set(s=>({draft:{...s.draft,guests:[...s.draft.guests,...g].slice(0,300)}})),removeGuest:id=>set(s=>({draft:{...s.draft,guests:s.draft.guests.filter(g=>g.id!==id)}})),reset:()=>set({draft:defaults,saved:null,wizardStep:0})}),{name:'toi-local-v1',storage:createJSONStorage(()=>localStorage),version:6,migrate:(state)=>{const p=state as {draft:Draft;saved:Saved|null};return {wizardStep:0,...p,draft:upgradeDraft(p.draft)};}}));
