import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Perfect Match',
  description: 'AR shoe try-on',
  icons: { icon: 'https://cdn-icons-png.flaticon.com/512/5499/5499242.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/main.css" />
        <link rel="stylesheet" href="/mycss.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <Script
          src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <header>
          <nav className="navbar fixed-top navbar-expand-sm navbar-light bg-white border-bottom box-shadow mb-3">
            <div className="container-fluid">
              <span className="navbar-brand d-flex align-items-center">
                <iconify-icon icon="ph:eye-light" width="30" height="30" style={{ marginRight: 10, marginLeft: 50 }} />
                <Link href="/" className="text-decoration-none text-dark ms-2">
                  Perfect Match
                </Link>
              </span>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarNav" />
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <Script src="/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
