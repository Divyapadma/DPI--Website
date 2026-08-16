import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import LeadForm from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the DPI team — office locations, phone, email, and enquiry form.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="We'd Love to Hear From You"
        description="Reach out for site visits, price sheets, or general enquiries — our team responds within one business day."
      />

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-5 lg:px-10">
        <ScrollReveal className="lg:col-span-2">
          <h2 className="font-display text-2xl text-ivory">Contact Details</h2>
          <ul className="mt-6 space-y-6">
            <li className="flex gap-4">
              <MapPin className="mt-1 shrink-0 text-gold" size={20} />
              <div>
                <p className="text-sm text-ivory">Head Office</p>
                <p className="text-sm text-mist">DPI Business Tower, Baner Road, Pune, Maharashtra 411045</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="mt-1 shrink-0 text-gold" size={20} />
              <div>
                <p className="text-sm text-ivory">Call Us</p>
                <a href="tel:+910000000000" className="text-sm text-mist hover:text-gold">
                  +91 00000 00000
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 shrink-0 text-gold" size={20} />
              <div>
                <p className="text-sm text-ivory">Email Us</p>
                <a href="mailto:info@dpi.com" className="text-sm text-mist hover:text-gold">
                  info@dpi.com
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MessageCircle className="mt-1 shrink-0 text-gold" size={20} />
              <div>
                <p className="text-sm text-ivory">WhatsApp</p>
                <a
                  href="https://wa.me/910000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-mist hover:text-gold"
                >
                  Chat with us
                </a>
              </div>
            </li>
          </ul>

          <div className="glass-card mt-10 flex h-64 items-center justify-center rounded-2xl">
            {/* TODO: embed real Google Maps iframe for office location(s) */}
            <p className="flex items-center gap-2 text-sm text-mist">
              <MapPin size={16} className="text-gold" />
              Office Location Map
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-display text-2xl text-ivory">Send Us a Message</h2>
            <p className="mt-2 text-sm text-mist">Fill in your details and we&apos;ll get back to you shortly.</p>
            <LeadForm formType="contact" className="mt-8" submitLabel="Send Message" />
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
