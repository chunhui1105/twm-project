import { Layout } from "@/components/layout";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGetContactInfo } from "@workspace/api-client-react";

const ICONS: Record<string, React.ElementType> = {
  address: MapPin,
  phone: Phone,
  email: Mail,
  operating_hours: Clock,
};

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const { data: contactInfo } = useGetContactInfo();

  const displayFields = (contactInfo ?? []).filter(item => item.key !== "map_embed_url");
  const mapEntry = (contactInfo ?? []).find(item => item.key === "map_embed_url");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", phone: "", message: "" });
      toast({ title: "Message sent!", description: "We'll get back to you within 1–2 business days." });
    }, 1000);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border py-20 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Get in Touch</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase leading-tight mb-6">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-xl leading-relaxed">
            Have a question about a product or need help finding the right accessory? We're here for you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tighter uppercase mb-6">Find Us</h2>
              <div className="space-y-5">
                {displayFields.map((item) => {
                  const Icon = ICONS[item.key] ?? MapPin;
                  return (
                    <div key={item.key} className="flex gap-4">
                      <div className="w-10 h-10 border border-border bg-card flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-sm font-medium whitespace-pre-line">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold tracking-tighter uppercase mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Your Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ahmad bin Abdullah"
                  className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email Address *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ahmad@email.com"
                  className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+60 12-345 6789"
                  className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-widest py-3 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Google Map */}
      {mapEntry?.value && (
        <section className="border-t border-border">
          <iframe
            src={mapEntry.value}
            width="100%"
            height="420"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      )}
    </Layout>
  );
}
