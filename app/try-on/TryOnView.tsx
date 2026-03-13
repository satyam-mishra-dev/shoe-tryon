'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PRODUCTS } from './products';

const licenseKey = process.env.NEXT_PUBLIC_DEEPAR_LICENSE_KEY || '';

export default function TryOnView() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deepARRef = useRef<Awaited<ReturnType<typeof import('deepar').initialize>> | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [feetVisible, setFeetVisible] = useState(true);
  const [reverseBtnVisible, setReverseBtnVisible] = useState(false);
  const facingModeRef = useRef<'environment' | 'user'>('environment');

  const initDeepAR = useCallback(
    async (effectName: string) => {
      if (!canvasRef.current || !licenseKey) {
        setLoading(false);
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

  return (
    <div className="container d-flex">
      <div className="col position-relative">
        <canvas ref={canvasRef} className="deepar" id="deepar-canvas" />
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
      <div className="col">
        <div className="list-product album" style={{ marginTop: 100 }}>
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
      </div>
    </div>
  );
}
