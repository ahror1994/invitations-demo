import {cookies} from 'next/headers';
import AdminTemplates from '@/components/AdminTemplates';
import {adminCookie,validAdminSession} from '@/lib/admin';
export const dynamic='force-dynamic';
export default async function AdminPage(){const jar=await cookies();return <AdminTemplates authorized={validAdminSession(jar.get(adminCookie)?.value||'')}/>;}
