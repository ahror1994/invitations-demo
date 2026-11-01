import Builder from '@/components/Builder';
export default async function Manage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Builder projectId={id}/>;}