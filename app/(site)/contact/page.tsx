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

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:gap-14 sm:px-6 sm:py-16 lg:grid-cols-5 lg:px-10 lg:py-20">
        <ScrollReveal className="lg:col-span-2">
          <h2 className="font-display text-xl text-charcoal sm:text-2xl">Contact Details</h2>
          <ul className="mt-6 space-y-5 sm:space-y-6">
            <li className="flex gap-4">
              <MapPin className="mt-1 shrink-0 text-terracotta" size={20} />
              <div className="min-w-0">
                <p className="text-sm text-charcoal">Head Office</p>
                <p className="text-sm text-taupe">DPI Business Tower, Baner Road, Pune, Maharashtra 411045</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="mt-1 shrink-0 text-terracotta" size={20} />
              <div>
                <p className="text-sm text-charcoal">Call Us</p>
                <a href="tel:+910000000000" className="inline-block py-1 text-sm text-taupe hover:text-terracotta">
                  +91 00000 00000
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 shrink-0 text-terracotta" size={20} />
              <div>
                <p className="text-sm text-charcoal">Email Us</p>
                <a href="mailto:info@dpi.com" className="inline-block py-1 text-sm text-taupe hover:text-terracotta break-all">
                  info@dpi.com
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MessageCircle className="mt-1 shrink-0 text-terracotta" size={20} />
              <div>
                <p className="text-sm text-charcoal">WhatsApp</p>
                <a
                  href="https://wa.me/910000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 text-sm text-taupe hover:text-terracotta"
                >
                  Chat with us
                </a>
              </div>
            </li>
          </ul>

          <div className="glass-card mt-8 flex h-52 items-center justify-center rounded-2xl sm:mt-10 sm:h-64">
            {/* TODO: embed real Google Maps iframe for office location(s) */}
            <p className="flex items-center gap-2 text-sm text-taupe">
              <MapPin size={16} className="text-terracotta" />
              Office Location Map
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl text-charcoal sm:text-2xl">Send Us a Message</h2>
            <p className="mt-2 text-sm text-taupe">Fill in your details and we&apos;ll get back to you shortly.</p>
            <LeadForm formType="contact" className="mt-6 sm:mt-8" submitLabel="Send Message" />
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
