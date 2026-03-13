import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      style={{
        background: 'url(/store.jpg) center/cover no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="container index-page w-50">
        <div style={{ marginTop: 250 }}>
          <h2>Perfect Match</h2>
          <p>Try on shoes in AR with your camera.</p>
          <Link
            href="/get-info"
            className="btn btn-primary btn-lg"
            style={{ width: 130, borderRadius: 30, margin: 10 }}
          >
            Get start
          </Link>
          <p className="mt-3 small">
            <Link href="/privacy" className="text-white text-decoration-underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
