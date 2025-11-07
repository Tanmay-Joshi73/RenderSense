'use client'
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, Zap, Bell, Link2, Server, Clock, CheckCircle, Github, FileText, Mail, ArrowRight, Code, Cpu, AlertTriangle, TrendingUp, Shield, Sparkles, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
const LandingPage = () => {
  const [activeService, setActiveService] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const route=useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'backdrop-blur-xl bg-slate-950/90 border-b border-slate-800 shadow-lg shadow-slate-900/50' 
            : 'backdrop-blur-lg bg-slate-950/50 border-b border-slate-800/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <Activity className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <motion.div
                  className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Render Uptime
                </span>
                <div className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                  Automator
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { href: '#problem', label: 'Problem' },
                { href: '#solution', label: 'Solution' },
                { href: '#features', label: 'Features' },
                { href: '#how-it-works', label: 'How It Works' },
                { href: '#tech-stack', label: 'Tech Stack' }
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-slate-300 hover:text-cyan-400 transition-all rounded-lg hover:bg-slate-800/50 font-medium"
                >
                  {item.label}
                </a>
              ))}
              
              <div className="ml-4 flex items-center space-x-3">
                <a
                  href="#"
                  className="px-4 py-2 text-slate-300 hover:text-white transition-all rounded-lg hover:bg-slate-800/50 font-medium"
                >
                  Sign In
                </a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold overflow-hidden group shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span onClick={function(){
                      route.push('/auth')
                    }}>Get Started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-cyan-400" />
              ) : (
                <Menu className="w-6 h-6 text-cyan-400" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{
              height: mobileMenuOpen ? 'auto' : 0,
              opacity: mobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="pt-4 pb-2 space-y-1">
              {[
                { href: '#problem', label: 'Problem' },
                { href: '#solution', label: 'Solution' },
                { href: '#features', label: 'Features' },
                { href: '#how-it-works', label: 'How It Works' },
                { href: '#tech-stack', label: 'Tech Stack' }
              ].map((item, idx) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -20 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all font-medium"
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="pt-2 space-y-2">
                <a
                  href="#"
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all font-medium text-center"
                >
                  Sign In
                </a>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
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
              <Sparkles className="w-4 h-4 inline mr-2" />
              Automated Monitoring Made Simple
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Monitor All Your Render Services Automatically
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-slate-400 mb-8">
              Stop manually creating monitors for each service. Connect once, monitor everything. Seamlessly integrate UptimeRobot with your entire Render infrastructure in seconds.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition flex items-center space-x-2">
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-3 bg-slate-800 border border-slate-700 rounded-lg font-semibold hover:bg-slate-700 transition">
                View Demo
              </button>
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-8 flex items-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Setup in 2 minutes</span>
              </div>
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

      {/* Problem Section */}
      <section id="problem" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              The Problem
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Manual Monitoring is Broken</h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Developers waste hours setting up monitoring for each service, leading to inconsistent coverage and missed downtime alerts.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Clock, 
                title: 'Time-Consuming Setup', 
                desc: 'Creating individual monitors for 10+ services takes hours. Every new deployment means more manual configuration.',
                stat: '2-3 hours per project'
              },
              { 
                icon: AlertTriangle, 
                title: 'Inconsistent Coverage', 
                desc: 'Easy to forget monitoring new services or miss updating URLs when services change, creating blind spots.',
                stat: '40% of services unmonitored'
              },
              { 
                icon: Server, 
                title: 'Scattered Management', 
                desc: 'Juggling between Render dashboard and UptimeRobot, manually syncing changes and tracking which services are monitored.',
                stat: 'Multiple platforms to manage'
              }
            ].map((problem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="backdrop-blur-xl bg-slate-800/50 border border-red-500/20 rounded-2xl p-8 hover:border-red-500/50 transition-all"
              >
                <problem.icon className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
                <p className="text-slate-400 mb-4">{problem.desc}</p>
                <div className="text-red-400 font-semibold text-sm">{problem.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              The Solution
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Automatic. Intelligent. Complete.</h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              One-click integration that discovers all your Render services and creates comprehensive monitoring coverage automatically.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Auto-Discovery</h3>
                  <p className="text-slate-400">Connect your Render API key once. The system automatically finds all your web services, APIs, and static sites—no manual entry needed.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Instant Monitors</h3>
                  <p className="text-slate-400">Automatically creates UptimeRobot monitors for each service with optimal settings. Health checks run every 5 minutes, alerts configured immediately.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Unified Dashboard</h3>
                  <p className="text-slate-400">View all service statuses in one place. Track uptime, response times, and get instant notifications when issues arise—all from a single interface.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">2 min</div>
                <div className="text-slate-400">From zero to full monitoring</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">Manual Setup</span>
                  <span className="text-red-400 font-semibold">2-3 hours</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-lg">
                  <span className="text-white font-semibold">With Automator</span>
                  <span className="text-green-400 font-semibold">2 minutes</span>
                </div>
              </div>
              <div className="mt-6 text-center text-sm text-slate-400">
                <CheckCircle className="w-4 h-4 inline text-green-400 mr-2" />
                90x faster deployment
              </div>
            </motion.div>
          </div>
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
              { icon: Server, title: 'Connect Your APIs', desc: 'Enter your Render and UptimeRobot API keys. Secure, encrypted, and stored safely.', step: '01' },
              { icon: Zap, title: 'Auto-Discovery', desc: 'System fetches all your Render services and creates corresponding UptimeRobot monitors instantly.', step: '02' },
              { icon: Activity, title: 'Monitor & Alert', desc: 'Real-time tracking begins immediately. Receive alerts via email, SMS, or Slack when issues occur.', step: '03' }
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
              { icon: Zap, title: 'Zero Configuration', desc: 'No manual setup or complex configurations required' },
              { icon: Activity, title: 'Real-Time Sync', desc: 'Automatic updates when services are added or removed' },
              { icon: Bell, title: 'Smart Alerts', desc: 'Get notified instantly via multiple channels' },
              { icon: Link2, title: 'API Integration', desc: 'Native Render and UptimeRobot API connections' },
              { icon: Shield, title: 'Secure & Private', desc: 'Encrypted API keys and secure data handling' },
              { icon: TrendingUp, title: 'Analytics Dashboard', desc: 'Track uptime trends and performance metrics' },
              { icon: Clock, title: '5-Min Checks', desc: 'Frequent health checks ensure quick issue detection' },
              { icon: Cpu, title: 'Multi-Service', desc: 'Supports web services, APIs, and static sites' }
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

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Automate Your Monitoring?</h2>
            <p className="text-slate-400 text-lg mb-8">
              Join developers who have automated their uptime monitoring. Set up in minutes, monitor forever.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition flex items-center space-x-2">
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-3 bg-slate-800 border border-slate-700 rounded-lg font-semibold hover:bg-slate-700 transition">
                View Documentation
              </button>
            </div>
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
            Built with ❤️ for developers. Copyright © 2025 Render Uptime Automator.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;