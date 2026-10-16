import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, FileText, ChevronRight } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-[#0b111e] py-12 sm:py-16 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand-navy">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">Privacy Policy</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-8 text-gray-700 leading-relaxed text-sm">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-teal">
              Data Protection & Privacy
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy-dark mt-1">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Last updated: January 2025 &bull; Baba Anandeshwar Internet Cafe, Kanpur
            </p>
          </div>

          {/* Privacy Guarantee Box */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Our Core Privacy Commitment
            </h3>
            <p>
              We adhere strictly to <strong>Privacy-by-Design</strong> principles. This website does <strong>NOT</strong> collect, request, or store Aadhaar numbers, PAN numbers, bank account numbers, OTPs, passwords, or document uploads. All sensitive physical document checks occur exclusively in person at our cafe.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Information We Collect</h2>
            <p>
              When using this website, we collect only minimal information necessary to schedule and verify your appointment or process your customer feedback:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
              <li><strong>Appointment Booking:</strong> Full Name, 10-digit mobile number, optional email, preferred service, date, time slot, and non-sensitive notes.</li>
              <li><strong>Customer Feedback:</strong> Display name, optional booking reference, rating, category, and review message.</li>
              <li><strong>Technical Logs:</strong> IP address and standard HTTP request headers for security logging and rate-limiting abuse prevention.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. How We Use Your Information</h2>
            <p>We use the collected information exclusively for:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
              <li>Scheduling your visit desk reservation at our Kanpur center.</li>
              <li>Generating your unique non-guessable booking reference code (BAC-YYYYMMDD-XXXXXX).</li>
              <li>Verifying booking ownership when you check status on the status lookup tool.</li>
              <li>Displaying approved customer reviews on our website (only when you have given explicit publication consent).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Non-Collection of Sensitive Credentials</h2>
            <p>
              In compliance with UIDAI regulations, the Information Technology Act (2000), and Indian digital personal data protection norms:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
              <li>We never store biometric data, fingerprint scans, or iris data on web servers.</li>
              <li>We never ask you to disclose banking passwords, UPI PINs, or confidential credentials.</li>
              <li>Customers must bring their physical identity documents to the cafe on the day of the appointment.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Data Retention Policy</h2>
            <p>
              Appointment records are archived and retained only as long as necessary for administrative audit and customer service coordination, after which old appointment records are safely anonymized or deleted according to retention policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">5. Contact Our Privacy Lead</h2>
            <p>
              If you have any questions regarding your data or wish to request deletion of past appointment records, contact:
            </p>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1">
              <p><strong>Business:</strong> Baba Anandeshwar Internet Cafe</p>
              <p><strong>Contact Person:</strong> Anurag Mishra</p>
              <p><strong>Address:</strong> Hanspuram, Naubasta, Kanpur, UP — 208021</p>
              <p><strong>Email:</strong> anandeshwarcafe@gmail.com</p>
              <p><strong>Phone:</strong> 6386463054 / 9005536781</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
