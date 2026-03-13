import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container privacy-page w-50" style={{ marginTop: 100, padding: 20 }}>
      <h1>Privacy Policy for Perfect Match</h1>
      <p>
        At Perfect Match, we prioritize the privacy of our users. This Privacy Policy outlines the types of personal information we collect, how it is used, and the measures we take to safeguard your information when you use our virtual try-on services.
      </p>
      <h3>Information We Collect</h3>
      <p>When you interact with our virtual try-on, we may collect certain personal information, including but not limited to:</p>
      <ul>
        <li>Contact information (such as name, email address)</li>
        <li>Measurements and body dimensions for personalized fitting recommendations</li>
        <li>User preferences, such as styles, sizes, and color choices</li>
        <li>Device information, IP address, browser type, and operating system</li>
      </ul>
      <h3>How We Use Your Information</h3>
      <p>We use the collected information to:</p>
      <ul>
        <li>Provide personalized virtual try-on experiences</li>
        <li>Improve our technology and user experience</li>
        <li>Ensure the security of our website and users&apos; information</li>
      </ul>
      <h3>Data Security</h3>
      <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
      <h3>Third-Party Links</h3>
      <p>Our website may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any personal information.</p>
      <p className="mt-4">
        <Link href="/">Back to home</Link>
      </p>
    </div>
  );
}
