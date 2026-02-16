import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Phone, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@projectflow.io" },
  { icon: MessageSquare, label: "Live Chat", value: "Available 9am–6pm EST" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
  { icon: MapPin, label: "Office", value: "New York, NY" },
];

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] rounded-full gradient-bg opacity-5 blur-3xl" />
      </div>

      <div className="container max-w-5xl relative z-10 px-4 py-20">
        <Button variant="ghost" className="mb-8 text-muted-foreground" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-sm font-medium text-accent">Contact</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
            Get in <span className="gradient-text">touch</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-16">
            Have a question, feedback, or want to learn more? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 glass-strong rounded-3xl p-8 gradient-shadow">
            <h2 className="font-semibold text-lg text-foreground mb-6">Send us a message</h2>
            <form className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Name</Label>
                  <Input placeholder="Your name" className="glass border-0 rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Email</Label>
                  <Input type="email" placeholder="you@example.com" className="glass border-0 rounded-xl h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Subject</Label>
                <Input placeholder="What's this about?" className="glass border-0 rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Message</Label>
                <Textarea placeholder="Tell us more..." className="glass border-0 rounded-xl min-h-[140px] resize-none" />
              </div>
              <Button className="gradient-bg gradient-shadow text-primary-foreground border-0 rounded-xl h-11 px-8">
                <Send className="h-4 w-4 mr-2" /> Send Message
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((c) => (
              <div key={c.label} className="glass rounded-2xl p-5 flex items-start gap-4">
                <div className="gradient-bg rounded-xl w-10 h-10 flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{c.label}</h3>
                  <p className="text-sm text-muted-foreground">{c.value}</p>
                </div>
              </div>
            ))}

            <div className="glass rounded-2xl p-6 mt-6">
              <h3 className="font-semibold text-foreground mb-2">Enterprise Inquiries</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For custom deployments, SSO, or dedicated support, contact our enterprise team at{" "}
                <span className="text-primary font-medium">enterprise@projectflow.io</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
