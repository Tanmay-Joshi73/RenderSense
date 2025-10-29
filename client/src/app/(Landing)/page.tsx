'use client'
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, Zap, Bell, Link2, Server, Clock, CheckCircle, Github, FileText, Mail, ArrowRight, Code, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';
const LandingPage = () => {
  const route=useRouter();
  const [activeService, setActiveService] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const services = [
    { name: 'api-service', status: 'active', uptime: '99.9%', responseTime: '145ms' },
    { name: 'web-frontend', status: 'active', uptime: '99.8%', responseTime: '89ms' },
    { name: 'worker-service', status: 'active', uptime: '100%', responseTime: '234ms' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 backdrop-blur-lg bg-slate-950/50 border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-xl">Render Uptime Automator</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition">How It Works</a>
            <a href="#tech-stack" className="hover:text-cyan-400 transition">Tech Stack</a>
            <a href="#about" className="hover:text-cyan-400 transition">About</a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            style={{ opacity, scale }}
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm">
              🚀 Automated Monitoring
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Never lose uptime again.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-slate-400 mb-8">
              Monitor your Render services automatically — no setup, no stress. Seamlessly integrate UptimeRobot with your entire Render infrastructure.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition flex items-center space-x-2" onClick={()=>{route.push('/Starter')}}>
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-3 bg-slate-800 border border-slate-700 rounded-lg font-semibold hover:bg-slate-700 transition">
                View Demo
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative backdrop-blur-xl bg-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-slate-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-slate-400 text-sm ml-4">Service Dashboard</span>
              </div>
              <div className="space-y-3">
                {services.map((service, idx) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className={`p-4 rounded-lg transition-all ${
                      activeService === idx 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50' 
                        : 'bg-slate-800/50 border border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-mono text-sm">{service.name}</span>
                      </div>
                      <span className="text-xs text-green-400 font-semibold">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                      <span>Response: {service.responseTime}</span>
                      <span className="text-green-400">● Online</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl"
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Three simple steps to automated monitoring</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Server, title: 'Fetch Render Services', desc: 'Automatically discover all your deployed services via Render API', step: '01' },
              { icon: Zap, title: 'Auto-Create Monitors', desc: 'Instantly create UptimeRobot monitors for each service without manual setup', step: '02' },
              { icon: Activity, title: 'Track Real-Time Status', desc: 'Monitor uptime, response times, and receive instant alerts on issues', step: '03' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative"
              >
                <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 group">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <item.icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-slate-400 text-lg">Everything you need for comprehensive monitoring</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Automatic Monitor Creation', desc: 'Zero-touch setup for all services' },
              { icon: Activity, title: 'Smart Status Dashboard', desc: 'Real-time insights at a glance' },
              { icon: Bell, title: 'Instant Alerts', desc: 'Get notified before users notice' },
              { icon: Link2, title: 'Seamless Integration', desc: 'Native Render API connection' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
              >
                <feature.icon className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech-stack" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built With Modern Tech</h2>
            <p className="text-slate-400 text-lg">Powered by industry-leading tools and frameworks</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {['NestJS', 'Next.js', 'TypeScript', 'Tailwind', 'Framer', 'Render', 'UptimeRobot', 'Axios'].map((tech, idx) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-xl bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center hover:border-cyan-500/50 transition-all"
              >
                <Code className="w-8 h-8 text-cyan-400 mb-2" />
                <span className="text-sm font-semibold text-center">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Developer */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 md:p-12"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                TJ
              </div>
              <div>
                <h3 className="text-2xl font-bold">Tanmay Joshi</h3>
                <p className="text-slate-400">Developer & GDGC Web Dev Coordinator 2024-25</p>
              </div>
            </div>
            <p className="text-slate-300 text-lg mb-4">
              Built to make Render monitoring effortless. This project combines the power of automated service discovery with intelligent uptime monitoring, saving developers countless hours of manual setup.
            </p>
            <p className="text-slate-400">
              As a passionate developer and coordinator at Google Developer Groups on Campus, I believe in creating tools that solve real problems and make developers' lives easier.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold">Render Uptime Automator</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-cyan-400 transition flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a href="#" className="hover:text-cyan-400 transition flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Docs</span>
              </a>
              <a href="#" className="hover:text-cyan-400 transition flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </a>
            </div>
          </div>
          <div className="text-center mt-8 text-slate-500 text-sm">
            Copyright © 2025 Tanmay Joshi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;