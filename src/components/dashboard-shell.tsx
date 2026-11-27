import Link from 'next/link';
import { Brand } from './brand';
import { LayoutDashboard, UserRound, Gamepad2, History, LifeBuoy, Shield, Users, Bot, Database, Settings, LogOut } from 'lucide-react';
import { signOut } from '@/app/actions';

export function DashboardShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const links = admin ? [
    ['/admin','Overview',LayoutDashboard], ['/admin/users','Users',Users], ['/admin/bot','Bot monitoring',Bot], ['/admin/database','Database',Database], ['/admin/settings','Settings',Settings]
  ] as const : [
    ['/dashboard','Overview',LayoutDashboard], ['/dashboard/profile','My profile',UserRound], ['/dashboard/games','Game stats',Gamepad2], ['/dashboard/history','Activity',History], ['/dashboard/support','Support',LifeBuoy]
  ] as const;
  return <div className="dashboard-layout"><aside className="sidebar"><Brand/><div className="side-label">WORKSPACE</div><nav>{links.map(([href,label,Icon])=><Link key={href} href={href}><Icon size={17}/>{label}</Link>)}</nav>{admin&&<div className="side-admin"><Shield size={15}/> Admin access</div>}<form action={signOut} className="logout-form"><button className="sidebar-logout"><LogOut size={16}/> Sign out</button></form></aside><main className="dashboard-main">{children}</main></div>;
}
