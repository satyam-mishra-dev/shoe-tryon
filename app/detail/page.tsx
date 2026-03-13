import Link from 'next/link';

export default function DetailPage() {
  return (
    <div
      style={{
        background: 'url(/store.jpg) center/cover no-repeat',
        minHeight: '100vh',
      }}
    >
      <div
        className="container w-50"
        style={{
          flexDirection: 'column',
          backgroundColor: '#fff',
          marginTop: 100,
          padding: 20,
          borderRadius: 30,
        }}
      >
        <h2 style={{ textAlign: 'center', margin: 20 }}>Your foot information</h2>
        <div className="d-flex text-group">
          <p className="text-bold" style={{ marginRight: 25 }}>Length:</p>
          <p>25,9cm</p>
        </div>
        <div className="d-flex text-group">
          <p className="text-bold" style={{ marginRight: 25 }}>Width:</p>
          <p>9,5cm</p>
        </div>
        <div className="d-flex text-group">
          <p className="text-bold" style={{ marginRight: 25 }}>Foot arches:</p>
          <span>
            <img src="/low.png" alt="arch" style={{ height: 80 }} />
          </span>
        </div>
        <div className="d-flex text-group">
          <p className="text-bold" style={{ marginRight: 25 }}>Foot shape:</p>
          <span>
            <img src="/greek-foot.jpg" alt="shape" style={{ height: 80 }} />
          </span>
        </div>
        <div className="text-center mt-4">
          <Link
            href="/try-on"
            className="btn btn-primary btn-lg"
            style={{ borderRadius: 10 }}
          >
            Show recommend products
          </Link>
        </div>
      </div>
    </div>
  );
}
