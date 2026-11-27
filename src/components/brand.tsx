import Image from 'next/image';
export function Brand({ compact = false }: { compact?: boolean }) {
  return <a href="/" className="brand-lockup" aria-label="Luxeria home">
    <Image src="/logo/luxeria-mark.svg" alt="" width={38} height={38} priority />
    {!compact && <span>LUXERIA</span>}
  </a>;
}
