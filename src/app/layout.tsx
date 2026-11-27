import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'LUXERIA | Beyond WhatsApp', template: '%s | LUXERIA' },
  description: 'The Luxeria digital ecosystem: AI, automation, entertainment and gaming.',
  applicationName: 'LUXERIA'
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
