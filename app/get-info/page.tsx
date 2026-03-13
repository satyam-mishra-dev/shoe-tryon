'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function GetInfoPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((all) => {
        const cameras = all.filter((d) => d.kind === 'videoinput');
        setDevices(cameras);
        if (cameras[1]) setSelectedId(cameras[1].deviceId);
        else if (cameras[0]) setSelectedId(cameras[0].deviceId);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedId || !videoRef.current) return;
    const constraints = { video: { deviceId: { exact: selectedId } } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setScanning(true);
        }
      })
      .catch(console.error);
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, [selectedId]);

  return (
    <div
      style={{
        background: 'url(/store.jpg) center/cover no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="container d-flex" style={{ marginTop: 100, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div className="camera-block">
          <select
            className="form-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || d.deviceId.slice(0, 20)}
              </option>
            ))}
          </select>
          <video
            ref={videoRef}
            id="videoElement"
            width={600}
            height={460}
            autoPlay
            playsInline
            muted
          />
          <canvas id="canvas" style={{ display: 'none' }} />
        </div>
        {scanning && (
          <div className="scan" style={{ marginRight: 120, marginTop: 70 }}>
            <div className="feetprint" />
            <h4>Scanning...</h4>
          </div>
        )}
      </div>
      <div className="container text-center mt-4">
        <Link
          href="/detail"
          className="btn btn-primary btn-lg"
          style={{ borderRadius: 10 }}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
