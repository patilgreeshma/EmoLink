import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingNavbar from "@/components/LandingNavbar";
import { Heart, Shield, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Heart,
    title: "Growth-Based Matching",
    description: "Connect with people who share your emotional development goals, not just your job title.",
  },
  {
    icon: Shield,
    title: "Safe Conversations",
    description: "A welcoming space designed for vulnerability, authenticity, and mutual support.",
  },
  {
    icon: Sparkles,
    title: "Personal Development Focus",
    description: "Every connection is an opportunity to grow, learn, and become your best self.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <LandingNavbar />

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight"
          >
            Connect Through{" "}
            <span className="text-gradient">Emotion</span>,{" "}
            Not Titles
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A networking platform built on emotional connection and personal development. Find people who understand your journey.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/feed">
              <Button size="lg" className="rounded-full px-8 gap-2 text-base shadow-warm-lg">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-foreground">
            Why Emo-Link?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="gradient-card rounded-2xl p-8 shadow-warm border border-border text-center hover:shadow-warm-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-3 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-warm py-20 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-heading font-bold mb-4 text-foreground">
            Ready to grow together?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join a community where every conversation is a step toward becoming who you want to be.
          </p>
          <Link to="/register">
            <Button size="lg" className="rounded-full px-8 gap-2 shadow-warm-lg">
              Join Emo-Link <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="font-heading font-semibold text-foreground">Emo-Link</p>
          <div className="flex gap-6">
            <span className="hover:text-foreground cursor-pointer transition-colors">About</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
          </div>
          <p>© 2026 Emo-Link. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
