import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronRight, FileCheck } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand-navy">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">Terms & Conditions</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-8 text-gray-700 leading-relaxed text-sm">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-teal">
              Legal Agreement & Terms of Service
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy-dark mt-1">
              Terms & Conditions
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Effective Date: January 2025 &bull; Baba Anandeshwar Internet Cafe
            </p>
          </div>

          {/* Statutory Disclaimers */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Statutory Government Disclaimers
            </h3>
            <p>
              Baba Anandeshwar Internet Cafe is a private, independent service facilitation center. We do <strong>NOT</strong> claim official government authorization or represent any government body. All government approvals, issuance dates, application outcomes, and processing timelines are governed solely by respective departments (e.g. UIDAI, Income Tax Department, Election Commission, UP FCS, E-District).
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Nature of Services</h2>
            <p>
              We provide customer facilitation, technical document scanning, biometric AEPS banking assistance through authorized correspondents, ticket booking assistance via authorized agents, typing, and printing. The customer is responsible for the authenticity and truthfulness of all personal documents, marks, and certificates submitted for online applications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. Appointment Booking & Punctuality</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
              <li>An appointment reservation grants priority desk assistance during the booked time slot.</li>
              <li>Customers should arrive 5 minutes prior to their booked time. In the event of a delay exceeding 15 minutes, the slot may be released to waiting walk-in customers.</li>
              <li>Holding a booking reference does not guarantee immediate document issuance where third-party servers (e.g. state servers) face technical outages.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Assistance Fees & Government Portal Fees</h2>
            <p>
              Fees displayed on our website represent cafe technical assistance, scanning, formatting, and printing charges. Statutory government fees (such as PAN government fees, Tatkal railway charges, passport fees, or traffic challan penalties) are additional and payable at actual rates to respective portals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Prohibited Activities</h2>
            <p>
              Users of our website and services agree not to attempt to upload falsified documents, impersonate others, probe system security, or flood booking slots with fake requests.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">5. Jurisdiction</h2>
            <p>
              Any disputes arising out of the services rendered by Baba Anandeshwar Internet Cafe shall be subject to the exclusive jurisdiction of the competent courts in Kanpur, Uttar Pradesh, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
