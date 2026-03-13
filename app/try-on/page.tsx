import dynamic from 'next/dynamic';

const TryOnView = dynamic(() => import('./TryOnView'), { ssr: false });

export default function TryOnPage() {
  return <TryOnView />;
}
