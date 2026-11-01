import type {Metadata} from 'next';
import './globals.css';
import BrandBackdrop from '@/components/BrandBackdrop';
import './brand.css';
export const metadata:Metadata={title:'Пригласительные — создайте свое',description:'Выберите оформление, напишите имена и скачайте красивое приглашение на русском, кыргызском, узбекском или английском.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body><BrandBackdrop/>{children}</body></html>;}
