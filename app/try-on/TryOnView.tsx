'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PRODUCTS } from './products';

// Read only in browser so it's the build-time value sent to the client (set in Vercel env and redeploy)
function getLicenseKey(): string {
  if (typeof window === 'undefined') return '';
  return (process.env.NEXT_PUBLIC_DEEPAR_LICENSE_KEY as string) || '';
}

export default function TryOnView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deepARRef = useRef<Awaited<ReturnType<typeof import('deepar').initialize>> | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [feetVisible, setFeetVisible] = useState(true);
  const [reverseBtnVisible, setReverseBtnVisible] = useState(false);
  const [noLicense, setNoLicense] = useState(false);
  const [licenseErrorType, setLicenseErrorType] = useState<'missing' | 'invalid' | null>(null);
  const [productsDrawerOpen, setProductsDrawerOpen] = useState(false);
  const facingModeRef = useRef<'environment' | 'user'>('environment');

  const initDeepAR = useCallback(
    async (effectName: string) => {
      const licenseKey = getLicenseKey();
      if (!canvasRef.current || !licenseKey || licenseKey.length < 10) {
        setLoading(false);
        setLicenseErrorType('missing');
        setNoLicense(true);
        return;
      }
      const canvas = canvasRef.current;
      const scale = window.devicePixelRatio || 1;
      const width =
        window.innerWidth > window.innerHeight
          ? Math.floor(window.innerHeight * 0.66)
          : window.innerWidth;
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(window.innerHeight * scale);
      (canvas.style as unknown as { maxHeight: string; maxWidth: string }).maxHeight =
        window.innerHeight + 'px';
      (canvas.style as unknown as { maxWidth: string }).maxWidth = width + 'px';

      try {
        const deepar = await import('deepar');
        const effectPath = `/effects/${effectName}`;
        const deepAR = await deepar.initialize({
          licenseKey,
          canvas,
          effect: effectPath,
          additionalOptions: {
            cameraConfig: { facingMode: facingModeRef.current },
            hint: 'footInit',
          },
        });
        deepARRef.current = deepAR;
        setLoading(false);
        setReverseBtnVisible(true);
        setFeetVisible(true);

        deepAR.callbacks.onFeetTracked = (leftFoot: { detected: boolean }, rightFoot: { detected: boolean }) => {
          if (leftFoot.detected || rightFoot.detected) {
            setFeetVisible(false);
            deepAR.callbacks.onFeetTracked = undefined;
          }
        };
      } catch (e) {
        console.error('DeepAR init error', e);
        setLoading(false);
        const msg = e instanceof Error ? e.message : String(e);
        // Key was present but init failed → likely domain not allowed in DeepAR dashboard
        setLicenseErrorType(
          licenseKey.length >= 10 || /license|not valid|invalid|domain|origin/i.test(msg)
            ? 'invalid'
            : 'missing'
        );
        setNoLicense(true);
      }
    },
    []
  );

  useEffect(() => {
    const effect = typeof window !== 'undefined' ? sessionStorage.getItem('selectedEffect') : null;
    setSelectedEffect(effect);
    if (effect) initDeepAR(effect);
    else setLoading(false);
  }, [initDeepAR]);

  const onProductClick = useCallback(
    (effectId: string) => {
      sessionStorage.setItem('selectedEffect', effectId);
      if (deepARRef.current) {
        deepARRef.current.shutdown?.();
        deepARRef.current = null;
      }
      setSelectedEffect(effectId);
      setLoading(true);
      setProductsDrawerOpen(false); // close drawer on mobile so user sees camera
      initDeepAR(effectId);
    },
    [initDeepAR]
  );

  const onReverseCamera = useCallback(() => {
    const deepAR = deepARRef.current;
    if (!deepAR) return;
    const next = facingModeRef.current === 'environment' ? 'user' : 'environment';
    facingModeRef.current = next;
    deepAR.stopCamera?.();
    deepAR.startCamera?.({ mediaStreamConstraints: { video: { facingMode: next } } });
  }, []);

  if (noLicense) {
    const isInvalid = licenseErrorType === 'invalid';
    return (
      <div className="container d-flex align-items-center justify-content-center min-vh-50 p-4">
        <div className="alert alert-warning mb-0" style={{ maxWidth: 560 }}>
          <strong>
            {isInvalid ? 'DeepAR license not valid for this domain' : 'DeepAR license not configured'}
          </strong>
          {isInvalid ? (
            <>
              <p className="mb-0 mt-2 small">
                Your key works on localhost but DeepAR keys are <strong>tied to the domain</strong>. Add your production domain in the DeepAR dashboard:
              </p>
              <ol className="small mb-2 mt-2 ps-3">
                <li>Go to <a href="https://developer.deepar.ai" target="_blank" rel="noopener noreferrer">developer.deepar.ai</a></li>
                <li>Open your project → your Web App (or add a new Web App)</li>
                <li>Add the <strong>domain only</strong>, e.g. <code>{typeof window !== 'undefined' ? window.location.hostname : 'your-app.vercel.app'}</code> (no https, no path)</li>
                <li>Save. The same license key then works for this domain.</li>
              </ol>
              <p className="mb-0 small text-muted">If you use a custom domain, add that instead.</p>
            </>
          ) : (
            <>
              <p className="mb-2 mt-2 small">
                Set <code>NEXT_PUBLIC_DEEPAR_LICENSE_KEY</code> in Vercel → Project → Settings → Environment Variables.
              </p>
              <p className="mb-0 small">
                <strong>Already set?</strong> The value is baked in at <strong>build time</strong>. You must:
              </p>
              <ol className="small mb-0 mt-1 ps-3">
                <li>Ensure the variable is enabled for <strong>Production</strong></li>
                <li>Trigger a <strong>new deployment</strong> (Deployments → ⋮ → Redeploy)</li>
                <li>Optionally enable <strong>Clear build cache</strong> when redeploying</li>
              </ol>
            </>
          )}
        </div>
      </div>
    );
  }

  const productCards = (
    <div className="list-product album" style={{ marginTop: 0 }}>
      <div className="container-fluid">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="col">
              <div
                className="product-card card"
                role="button"
                tabIndex={0}
                onClick={() => onProductClick(p.id)}
                onKeyDown={(e) => e.key === 'Enter' && onProductClick(p.id)}
                style={{ cursor: 'pointer' }}
              >
                <span className="img-span">
                  <img className="card-img-top" src={p.image} alt={p.name} />
                </span>
                <div style={{ flex: '1 1 auto', padding: '0rem 0.8rem' }}>
                  <div className="d-flex justify-content-between align-items-center" style={{ marginTop: 5 }}>
                    <div className="name-span">
                      <p className="card-name">{p.name}</p>
                    </div>
                    <div className="btn-group group">
                      <a
                        className="cart-link d-flex"
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <iconify-icon icon="material-symbols:info-outline" width="15" height="15" style={{ marginRight: 5, cursor: 'pointer' }} />
                        <iconify-icon className="cartIcon" icon="pepicons-pop:cart" width="15" height="15" />
                      </a>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <a className="price">{p.price}</a>
                    <div className="d-flex justify-content-md-between" style={{ marginTop: 5 }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <iconify-icon key={i} icon="ic:outline-star" width="15" height="15" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="tryon-wrapper container d-flex">
        <div className="col position-relative tryon-camera-col">
          <canvas ref={canvasRef} className="deepar tryon-canvas" id="deepar-canvas" />
          {reverseBtnVisible && (
            <button
              type="button"
              onClick={onReverseCamera}
              className="btn btn-outline-light btn-sm position-absolute"
              style={{ bottom: 80, left: 16, zIndex: 10 }}
              title="Switch camera"
            >
              <iconify-icon icon="mdi:camera-switch" width="24" height="24" />
            </button>
          )}
          {/* Mobile: floating button to open product drawer */}
          <button
            type="button"
            className="btn btn-primary position-absolute d-lg-none products-drawer-toggle"
            style={{ bottom: 24, right: 16, zIndex: 10, borderRadius: 28, padding: '10px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
            onClick={() => setProductsDrawerOpen(true)}
            aria-label="Open shoes"
          >
            <iconify-icon icon="mdi:shoe-sneaker" width="22" height="22" style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Shoes
          </button>
          <div id="brand-text" style={{ display: loading ? 'none' : 'flex' }}>
            <h4 style={{ margin: 0 }}>PerfectMatch</h4>
          </div>
          {loading && (
            <div id="loader-wrapper" style={{ display: 'block' }}>
              <span className="loader" />
            </div>
          )}
          {feetVisible && !loading && (
            <h3 id="feet-text">Click the shoes and put your feet in picture</h3>
          )}
        </div>
        {/* Desktop: sidebar always visible */}
        <div className="col tryon-products-col d-none d-lg-block">
          <div style={{ marginTop: 100 }}>{productCards}</div>
        </div>
      </div>

      {/* Mobile: collapsible bottom sheet for products */}
      <div
        className="products-drawer-backdrop d-lg-none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: productsDrawerOpen ? 'rgba(0,0,0,0.4)' : 'transparent',
          pointerEvents: productsDrawerOpen ? 'auto' : 'none',
          zIndex: 1040,
          transition: 'background-color 0.25s ease',
        }}
        onClick={() => setProductsDrawerOpen(false)}
        aria-hidden={!productsDrawerOpen}
      />
      <div
        className="products-drawer d-lg-none"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '75vh',
          backgroundColor: '#fff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.2)',
          zIndex: 1050,
          transform: productsDrawerOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease-out',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
          <h5 className="mb-0">Choose a shoe</h5>
          <button
            type="button"
            className="btn btn-link text-dark p-2"
            onClick={() => setProductsDrawerOpen(false)}
            aria-label="Close"
          >
            <iconify-icon icon="mdi:close" width="28" height="28" />
          </button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: 12 }} onClick={(e) => e.stopPropagation()}>
          {productCards}
        </div>
      </div>
    </>
  );
}
