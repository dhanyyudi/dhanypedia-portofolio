'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Send, 
  Mail, 
  MapPin, 
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Navigation as NavIcon,
  Layers,
  Phone
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import type { ContactFormData } from '@/types';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
      
      if (!formId) {
        throw new Error('Form ID not configured');
      }

      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        const errorData = await response.json();
        console.error('Form error:', errorData);
        alert('Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      // Fallback for demo if ID is missing (optional, or just alert)
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background-primary)] overflow-x-hidden">
      <Navigation />
      
      {/* Background Decor - Abstract Map Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[var(--accent-primary)]"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
         </svg>
      </div>

      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6 }}
              >
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                      Let's Map Your Vision
                  </h1>
                  <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                      Ready to collaborate on geospatial solutions? Reach out for project inquiries, consulting, or just to talk maps.
                  </p>
              </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Contact Details Card */}
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="lg:col-span-5 flex flex-col"
            >
                <div className="glass-card p-8 h-full relative overflow-hidden group border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 transition-colors duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Globe size={120} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <Layers className="text-[var(--accent-primary)]" />
                        Contact Coordinates
                    </h3>

                    <div className="space-y-8 relative z-10">
                        <div className="flex items-start gap-4 group/item">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover/item:border-[var(--accent-primary)] group-hover/item:bg-[var(--accent-primary)]/10 transition-all">
                                <Mail size={24} className="text-[var(--text-secondary)] group-hover/item:text-[var(--accent-primary)] transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--accent-secondary)] uppercase tracking-wider mb-1">Email Address</h4>
                                <a href="mailto:hello@dhanypedia.com" className="text-xl text-white hover:text-[var(--accent-primary)] transition-colors font-medium">
                                    hello@dhanypedia.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group/item">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover/item:border-[var(--accent-primary)] group-hover/item:bg-[var(--accent-primary)]/10 transition-all">
                                <MapPin size={24} className="text-[var(--text-secondary)] group-hover/item:text-[var(--accent-primary)] transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--accent-secondary)] uppercase tracking-wider mb-1">Base Location</h4>
                                <p className="text-xl text-white font-medium">Jakarta, Indonesia</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-muted)] bg-black/20 px-3 py-1 rounded-full w-fit">
                                    <NavIcon size={12} />
                                    <span>Lat: -6.2088, Lng: 106.8456</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10">
                         <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Connect on Social</h4>
                         <div className="flex gap-4">
                            {[
                                { icon: <Github size={20} />, url: "https://github.com/dhanypedia", label: "Github" },
                                { icon: <Linkedin size={20} />, url: "https://linkedin.com/in/dhanypedia", label: "LinkedIn" },
                                { icon: <Twitter size={20} />, url: "https://twitter.com/dhanypedia", label: "Twitter" }
                            ].map((social, index) => (
                                <a
                                  key={index}
                                  href={social.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white text-[var(--text-secondary)] transition-all transform hover:-translate-y-1"
                                >
                                    {social.icon}
                                </a>
                            ))}
                         </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Column: Clean Professional Form */}
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="lg:col-span-7"
            >
               <div className="glass-card p-8 md:p-10 border border-[var(--border-color)] h-full">
                   <h3 className="text-2xl font-bold text-white mb-6">Send Message</h3>
                   
                   <AnimatePresence mode='wait'>
                        {isSubmitted ? (
                           <motion.div
                             key="success"
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="flex flex-col items-center justify-center h-[400px] text-center"
                           >
                             <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle size={40} className="text-green-500" />
                             </div>
                             <h4 className="text-2xl font-bold text-white mb-2">Message Received</h4>
                             <p className="text-[var(--text-secondary)]">Thanks for reaching out! I'll get back to you shortly.</p>
                           </motion.div>
                        ) : (
                           <motion.form 
                             key="form"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             onSubmit={handleSubmit(onSubmit)} 
                             className="space-y-6"
                           >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                      <label htmlFor="name" className="text-sm font-medium text-[var(--text-secondary)]">Full Name</label>
                                      <input
                                          id="name"
                                          type="text"
                                          className={`input-field ${errors.name ? 'border-red-500/50' : ''}`}
                                          placeholder="John Doe"
                                          {...register('name', { required: 'Name is required' })}
                                      />
                                      {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                                  </div>
                                  <div className="space-y-2">
                                      <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
                                      <input
                                          id="email"
                                          type="email"
                                          className={`input-field ${errors.email ? 'border-red-500/50' : ''}`}
                                          placeholder="john@example.com"
                                          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                                      />
                                      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label htmlFor="subject" className="text-sm font-medium text-[var(--text-secondary)]">Subject</label>
                                  <input
                                      id="subject"
                                      type="text"
                                      className={`input-field ${errors.subject ? 'border-red-500/50' : ''}`}
                                      placeholder="Project Inquiry"
                                      {...register('subject', { required: 'Subject is required' })}
                                  />
                                   {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
                              </div>

                              <div className="space-y-2">
                                  <label htmlFor="message" className="text-sm font-medium text-[var(--text-secondary)]">Message</label>
                                  <textarea
                                      id="message"
                                      rows={6}
                                      className={`input-field resize-none ${errors.message ? 'border-red-500/50' : ''}`}
                                      placeholder="Tell me about your project or idea..."
                                      {...register('message', { required: 'Message is required' })}
                                  />
                                  {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                              </div>

                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-glow py-4 text-base font-semibold"
                              >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                              </button>
                           </motion.form>
                        )}
                   </AnimatePresence>
               </div>
            </motion.div>

          </div>
        </div>
      </section>
      
      <footer className="py-8 text-center text-sm text-[var(--text-muted)] border-t border-white/5 relative z-10">
        <p>© {new Date().getFullYear()} Dhanypedia. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
