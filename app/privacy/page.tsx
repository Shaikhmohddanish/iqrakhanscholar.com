import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'
import { contactEmail } from '@/lib/site-data'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Iqra Khan Scholar privacy policy - how we collect, use, and protect your personal data.',
  alternates: { canonical: '/privacy' },
}

const sections = [
  { id: 'controller', title: 'Data Controller' },
  { id: 'data-collected', title: 'Data We Collect' },
  { id: 'purpose', title: 'Purpose of Processing' },
  { id: 'legal-basis', title: 'Legal Basis' },
  { id: 'retention', title: 'Data Retention' },
  { id: 'third-parties', title: 'Third-Party Processors' },
  { id: 'recordings', title: 'Session Recordings' },
  { id: 'cookies', title: 'Cookies & Advertising' },
  { id: 'security', title: 'Security & Liability' },
  { id: 'acceptable-use', title: 'Acceptable Use' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'your-rights', title: 'Your Rights' },
  { id: 'changes', title: 'Changes to This Policy' },
  { id: 'governing-law', title: 'Governing Law' },
  { id: 'complaints', title: 'Complaints' },
  { id: 'contact', title: 'Contact Us' },
]

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <LegalPageLayout title="Privacy Policy" lastUpdated="5 August 2026" sections={sections}>
          <p>
            This Privacy Policy explains how Iqra Khan (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
            &ldquo;our&rdquo;) collects, uses, discloses, and protects personal data of users of{' '}
            <a href={SITE_URL}>{SITE_URL.replace(/^https?:\/\//, '')}</a> (&ldquo;the
            Website&rdquo;). By using the Website, purchasing digital content, or booking a
            consultation, you acknowledge that you have read and understood this Policy.
          </p>

          <section id="controller">
            <h2>1. Data Controller</h2>
            <p>
              Iqra Khan Scholar
              <br />
              Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <br />
              Website: <a href={SITE_URL}>{SITE_URL}</a>
            </p>
          </section>

          <section id="data-collected">
            <h2>2. Data We Collect</h2>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Examples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Account data</td>
                    <td>Name, email address, password (stored as a hash)</td>
                  </tr>
                  <tr>
                    <td>Order data</td>
                    <td>Shipping address, order history, payment reference</td>
                  </tr>
                  <tr>
                    <td>Usage data</td>
                    <td>Pages visited, reading progress, session duration</td>
                  </tr>
                  <tr>
                    <td>Communication data</td>
                    <td>Contact form submissions, consultation notes</td>
                  </tr>
                  <tr>
                    <td>Session recordings</td>
                    <td>
                      Audio recording of a one-to-one consultation, where the session
                      tier includes one and you have agreed to it
                    </td>
                  </tr>
                  <tr>
                    <td>Technical data</td>
                    <td>IP address, browser type, device information</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              We do not store full card or banking details. Payments are processed by Razorpay in
              compliance with PCI-DSS standards; we only retain a payment reference.
            </p>
            <p>
              Consultation notes may occasionally include sensitive personal information shared
              voluntarily during sessions (e.g. related to personal, family, or emotional matters).
              We treat this information with additional confidentiality safeguards, access to such
              notes is restricted to Iqra Khan only, and this data is not shared with any third
              party except where legally required.
            </p>
          </section>

          <section id="purpose">
            <h2>3. Purpose of Processing</h2>
            <p>We process personal data to:</p>
            <ul>
              <li>Create and manage user accounts</li>
              <li>Process orders and deliver digital content</li>
              <li>Schedule and manage consultations</li>
              <li>Send order confirmations and service updates</li>
              <li>Improve the Website and our services</li>
              <li>Respond to enquiries</li>
              <li>Send marketing communications (with consent)</li>
              <li>
                Protect our legal rights, enforce our Terms of Service, and prevent misuse, fraud,
                or unauthorised access to the Website or its content
              </li>
            </ul>
          </section>

          <section id="legal-basis">
            <h2>4. Legal Basis for Processing (Article 6 GDPR)</h2>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Purpose</th>
                    <th>Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Order processing, digital content delivery, consultations</td>
                    <td>Contract</td>
                  </tr>
                  <tr>
                    <td>Marketing communications, analytics cookies, optional data collection</td>
                    <td>Consent</td>
                  </tr>
                  <tr>
                    <td>
                      Fraud prevention, website security, service improvement, enforcement of our
                      rights and Terms of Service, business analytics
                    </td>
                    <td>Legitimate interest</td>
                  </tr>
                  <tr>
                    <td>Tax and accounting records</td>
                    <td>Legal obligation</td>
                  </tr>
                  <tr>
                    <td>Sensitive information shared during consultations</td>
                    <td>Explicit consent (given voluntarily when booking/attending a session)</td>
                  </tr>
                  <tr>
                    <td>Session recordings</td>
                    <td>
                      Explicit consent, confirmed at the start of the session before any
                      recording begins. You may decline and still have the session.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="retention">
            <h2>5. Data Retention</h2>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Data Type</th>
                    <th>Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Account data</td>
                    <td>
                      Until account deletion, or longer if required to resolve disputes, enforce our
                      agreements, or comply with legal obligations
                    </td>
                  </tr>
                  <tr>
                    <td>Order data</td>
                    <td>7 years (tax obligations)</td>
                  </tr>
                  <tr>
                    <td>Consultation notes</td>
                    <td>3 years after the last session</td>
                  </tr>
                  <tr>
                    <td>Session recordings</td>
                    <td>12 months after the session, then permanently deleted &mdash; or sooner on request</td>
                  </tr>
                  <tr>
                    <td>Marketing consent</td>
                    <td>Until withdrawn</td>
                  </tr>
                  <tr>
                    <td>Technical logs</td>
                    <td>90 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              We reserve the right to retain data beyond the periods above where necessary to
              protect our legal interests, defend against claims, or comply with a legal or
              regulatory requirement.
            </p>
          </section>

          <section id="third-parties">
            <h2>6. Third-Party Processors</h2>
            <ul>
              <li>
                <strong>Razorpay</strong> - Payment processing
              </li>
              <li>
                <strong>MongoDB Atlas</strong> - Database hosting
              </li>
              <li>
                <strong>Cloudinary</strong> - Image and media hosting
              </li>
              <li>
                <strong>Vercel</strong> - Website hosting and analytics
              </li>
              <li>
                <strong>Google</strong> - Google Meet hosts consultation sessions, and
                Google Drive stores session recordings where one has been made
              </li>
              <li>
                <strong>Google AdSense</strong> - Third-party advertising, loaded only on
                our blog pages and only if you accept marketing cookies
              </li>
            </ul>
            <p>
              All processors are contractually bound to protect data in line with applicable data
              protection law. We may add, remove, or change processors at our discretion to operate
              and improve the Website; this Policy will be updated to reflect material changes, but
              individual notice will not be given for routine processor changes.
            </p>
            <h3>International Data Transfers</h3>
            <p>
              Some processors may store or process data outside your country of residence. Where
              this occurs, we rely on Standard Contractual Clauses or equivalent safeguards.
            </p>
          </section>

          {/* Consultation tiers all advertise "Session recording", and this
              policy previously never mentioned recordings at all - not what is
              captured, not where it is kept, not for how long, and not how
              consent is taken. */}
          <section id="recordings">
            <h2>7. Session Recordings</h2>
            <p>
              Each consultation tier includes an audio recording of your session so you can
              revisit the guidance afterwards. Recordings are <strong>audio only</strong> &mdash;
              sessions are held as an audio call on Google Meet and video is not used.
            </p>
            <h3>Your consent</h3>
            <p>
              Nothing is recorded without your agreement. You are asked at the start of the
              session, before recording begins, and you may decline &mdash; the session goes
              ahead either way. You can also ask for recording to stop at any point during the
              session.
            </p>
            <h3>Storage and access</h3>
            <p>
              Recordings are made through Google Meet and stored in a private Google Drive
              folder accessible only to Iqra Khan. They are shared with you and with nobody
              else. They are never published, never used in marketing or teaching material,
              and never sold or shared with third parties.
            </p>
            <h3>Retention and deletion</h3>
            <p>
              Recordings are kept for <strong>12 months</strong> after the session and then
              permanently deleted. You can ask us to delete your recording sooner at any time
              by emailing{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>, and we will confirm once
              it is done.
            </p>
            <p>
              Because a consultation may involve sensitive personal circumstances, recordings
              are treated as special-category data and processed only on the basis of your
              explicit consent.
            </p>
          </section>

          <section id="cookies">
            <h2>8. Cookies &amp; Advertising</h2>
            <p>
              Essential, analytics, and preference cookies are used as described in our{' '}
              <Link href="/cookie-policy">Cookie Policy</Link>. Advertising cookies via Google
              AdSense are used <strong>only on our blog pages</strong>, and only if you accept
              marketing cookies in our consent banner. If you decline, the advertising script is
              never loaded. You can also opt out via{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>{' '}
              or{' '}
              <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
                www.aboutads.info/choices
              </a>
              .
            </p>
          </section>

          <section id="security">
            <h2>9. Data Security &amp; Limitation of Liability</h2>
            <p>
              We implement reasonable technical and organisational measures - including password
              hashing, restricted access, and encrypted transmission - to protect your data.
              However, no method of transmission or storage is 100% secure, and we cannot guarantee
              absolute security. To the maximum extent permitted by law, we disclaim liability for
              unauthorised access, loss, or disclosure of data resulting from circumstances beyond
              our reasonable control, including third-party processor failures, cyberattacks, or
              user negligence (e.g. weak passwords, sharing login credentials).
            </p>
            <p>
              In the event of a data breach affecting your personal data, we will notify affected
              users and relevant authorities as required by applicable law.
            </p>
          </section>

          <section id="acceptable-use">
            <h2>10. Acceptable Use</h2>
            <p>
              Content, materials, and information provided through the Website - including digital
              products and consultation materials - are for your personal use only. You may not
              copy, reproduce, distribute, modify, reverse-engineer, or create derivative works from
              any Website content without our prior written consent. Unauthorised use may result in
              suspension of access and/or legal action.
            </p>
          </section>

          <section id="children">
            <h2>11. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed at children under 16. We do not knowingly collect data
              from children. If you believe a child has provided personal data without parental
              consent, contact us for removal.
            </p>
          </section>

          <section id="your-rights">
            <h2>12. Your Rights</h2>
            <ul>
              <li>
                <strong>Access</strong> - Request a copy of your data
              </li>
              <li>
                <strong>Rectification</strong> - Correct inaccurate data
              </li>
              <li>
                <strong>Erasure</strong> - Request deletion (&ldquo;right to be forgotten&rdquo;)
              </li>
              <li>
                <strong>Portability</strong> - Receive data in a machine-readable format
              </li>
              <li>
                <strong>Objection</strong> - Object to processing based on legitimate interest
              </li>
              <li>
                <strong>Restriction</strong> - Request limited processing
              </li>
              <li>
                <strong>Withdraw consent</strong> - At any time for consent-based processing
              </li>
            </ul>
            <p>
              These rights may be subject to exemptions permitted under applicable law, including
              where retention is necessary for legal compliance or to establish, exercise, or defend
              legal claims. To exercise your rights, use your account{' '}
              <Link href="/account/settings">Settings</Link> page or email{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We aim to respond within one
              month.
            </p>
          </section>

          <section id="changes">
            <h2>13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy at any time at our sole discretion, to reflect
              changes in our practices, technology, legal requirements, or business operations. The
              &ldquo;Last updated&rdquo; date will be revised accordingly. Continued use of the
              Website after changes take effect constitutes acceptance of the revised Policy. We
              encourage you to review this page periodically.
            </p>
          </section>

          <section id="governing-law">
            <h2>14. Governing Law</h2>
            <p>
              This Privacy Policy shall be governed by and interpreted in accordance with the laws
              of India, without regard to conflict of law principles, except where mandatory local
              data protection law (such as the GDPR, for EU-based users) grants you rights that
              cannot be overridden. Any disputes arising from this Policy shall be subject to the
              exclusive jurisdiction of the courts of New Delhi.
            </p>
          </section>

          <section id="complaints">
            <h2>15. Complaints</h2>
            <p>
              If you believe your data protection rights have been violated, you may lodge a
              complaint with your local data protection authority (for EU residents, via the{' '}
              <a
                href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                target="_blank"
                rel="noopener noreferrer"
              >
                European Data Protection Board
              </a>
              ).
            </p>
          </section>

          <section id="contact">
            <h2>16. Contact Us</h2>
            <p>
              Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </p>
          </section>
        </LegalPageLayout>
      </main>
      <SiteFooter />
    </>
  )
}
