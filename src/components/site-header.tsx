import Link from 'next/link';
import { Brand } from './brand';
export function SiteHeader() {
  return <header className="site-header"><Brand/><nav className="desktop-nav"><Link href="/features">Features</Link><Link href="/commands">Commands</Link><Link href="/games">Game Hub</Link><Link href="/status">Status</Link></nav><div className="header-actions"><Link className="nav-login" href="/login">Log in</Link><Link className="button button-small" href="/register">Get started <span>↗</span></Link></div></header>;
}
