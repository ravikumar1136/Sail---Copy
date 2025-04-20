import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>
                Steel Authority of India Limited (SAIL) is committed to protecting your privacy and ensuring the
                security of your personal information. This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="mb-4">
                We may collect personal information that you provide to us, including but not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Name, email address, phone number, and other contact details</li>
                <li>Company information and job title</li>
                <li>Order history and preferences</li>
                <li>Account credentials</li>
                <li>Feedback and correspondence</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="mb-4">We may use the information we collect for various purposes, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Providing, maintaining, and improving our services</li>
                <li>Processing and fulfilling orders</li>
                <li>Communicating with you about products, services, and promotions</li>
                <li>Responding to your inquiries and providing customer support</li>
                <li>Analyzing usage patterns and improving user experience</li>
                <li>Protecting against fraudulent or unauthorized transactions</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
              <p className="mb-4">
                We may share your information with third parties only in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>With service providers who perform services on our behalf</li>
                <li>To comply with legal obligations</li>
                <li>To protect and defend our rights and property</li>
                <li>With your consent or at your direction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, accidental loss, alteration, or destruction. However, no method of
                transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing of your personal information</li>
                <li>Data portability</li>
                <li>Objection to processing of your personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
                updated Privacy Policy on this page with a new effective date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us
                at privacy@sail.co.in.
              </p>
            </section>

            <p className="text-sm text-muted-foreground">Last updated: March 24, 2025</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

