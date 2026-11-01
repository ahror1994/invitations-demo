import Builder from '@/components/Builder';
export default async function CreatePage({searchParams}:{searchParams:Promise<{step?:string}>}){const p=await searchParams;const n=Number(p.step||0);return <Builder initialStep={Number.isInteger(n)&&n>=0&&n<=5?n:0}/>;}
