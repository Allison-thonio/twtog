"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import SplashScreen from "@/components/splash-screen"
import StackCards from "@/components/stack-cards"
import { HeroScrollDemo } from "@/components/hero-scroll-demo"
import Link from "next/link"
import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { motion } from "framer-motion"
import { ArrowRight, Leaf, Users, Star } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Check if user has seen the splash screen
    const splashSeen = localStorage.getItem("splashSeen")
    if (splashSeen) {
      setShowSplash(false)
    }
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <StackCards />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2940&auto=format&fit=crop"
            alt="TWT Fashion Collection"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            <span className="swanky-brand text-3xl md:text-5xl text-primary mb-6 block tracking-widest">
              TWT
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-light tracking-tighter mb-8 text-white leading-none">
              TIMLESS <br />
              <span className="font-serif italic text-primary/90 block mt-2">ESSENCE</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-2xl mx-auto leading-relaxed font-light italic">
              "Fashion that speaks of eternity, ethically crafted for the modern soul."
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/shop">
                <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 shadow-xl">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="h-16 px-12 text-xl rounded-full border-white/40 text-white hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm">
                  The Story
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white"></div>
          <span className="text-[10px] tracking-[0.4em] text-white uppercase">Scroll</span>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-light tracking-tight mb-2">Shop by Category</h2>
                <p className="text-muted-foreground">Curated collections for every style.</p>
              </div>
              <Link href="/shop" className="group flex items-center text-sm font-medium tracking-widest hover:text-primary transition-colors text-foreground">
                VIEW ALL <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/women">
              <ScrollReveal delay={0.3}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative h-[600px] overflow-hidden rounded-sm cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2787&auto=format&fit=crop"
                    alt="Women's Collection"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-10 left-10 text-white">
                    <span className="text-sm tracking-widest uppercase mb-2 block opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">Collection</span>
                    <h3 className="text-5xl font-serif italic mb-2">Women</h3>
                    <p className="text-white/80 font-light">Effortless elegance for the modern muse.</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            </Link>

            <Link href="/men">
              <ScrollReveal delay={0.5}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative h-[600px] overflow-hidden rounded-sm cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=2864&auto=format&fit=crop"
                    alt="Men's Collection"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-10 left-10 text-white">
                    <span className="text-sm tracking-widest uppercase mb-2 block opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">Collection</span>
                    <h3 className="text-5xl font-serif italic mb-2">Men</h3>
                    <p className="text-white/80 font-light">Refined essentials for the contemporary man.</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            </Link>
          </div>
        </div>
      </section>

      {/* Collection Scroll Showcase */}
      <section className="bg-background">
        <HeroScrollDemo />
      </section>

      {/* About the Brand Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal className="relative">
              <div className="aspect-[4/5] bg-stone-200 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2940&auto=format&fit=crop" alt="About TWT" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-background p-8 rounded-full flex items-center justify-center shadow-xl hidden md:flex">
                <div className="text-center">
                  <span className="block text-4xl font-bold text-primary">100%</span>
                  <span className="text-xs tracking-widest uppercase text-foreground">Ethical</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <span className="swanky-brand text-2xl text-primary mb-4 block">Our Philosophy</span>
              <h2 className="text-4xl md:text-5xl font-light mb-8 text-balance leading-tight text-foreground">
                Crafted with Care, <br />
                <span className="font-serif italic text-muted-foreground">Designed for Life.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed font-light">
                We believe in radical transparency and ethical production. Every garment is crafted with care, using
                sustainable materials and fair labor practices. Our timeless designs transcend seasonal trends, creating
                pieces you'll treasure for years to come.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">Sustainable Materials</h3>
                    <p className="text-muted-foreground font-light">Eco-friendly fabrics that love the planet back.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">Ethical Production</h3>
                    <p className="text-muted-foreground font-light">Fair wages and safe working conditions for all.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">Timeless Design</h3>
                    <p className="text-muted-foreground font-light">Pieces designed to last beyond the season.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Link href="/about">
                  <Button variant="link" className="text-lg p-0 h-auto hover:text-primary transition-colors text-foreground">
                    Read more about our journey <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-balance">Stay in the Loop</h2>
            <p className="text-background/70 mb-10 text-lg font-light">
              Be the first to know about new collections, sustainability initiatives, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12 bg-background/10 border-background/20 text-background placeholder:text-background/50 focus-visible:ring-background/30"
              />
              <Button className="h-12 px-8 bg-background text-foreground hover:bg-background/90 font-medium">
                Subscribe
              </Button>
            </div>
            <p className="mt-6 text-xs text-background/40">
              By subscribing you agree to our Terms & Conditions and Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background text-foreground py-16 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <Link href="/" className="block">
                <span className="text-2xl font-light tracking-[0.2em]">TWT</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Timeless style with transparent values. Fashion that makes a difference.
              </p>
              <div className="flex gap-4 pt-2">
                {/* Social icons placeholders */}
                <div className="w-8 h-8 bg-muted rounded-full hover:bg-primary/20 transition-colors cursor-pointer"></div>
                <div className="w-8 h-8 bg-muted rounded-full hover:bg-primary/20 transition-colors cursor-pointer"></div>
                <div className="w-8 h-8 bg-muted rounded-full hover:bg-primary/20 transition-colors cursor-pointer"></div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-6 tracking-wide text-sm uppercase text-foreground">Shop</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/women" className="hover:text-primary transition-colors">Women</Link></li>
                <li><Link href="/men" className="hover:text-primary transition-colors">Men</Link></li>
                <li><Link href="/accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
                <li><Link href="/shop" className="hover:text-primary transition-colors">All Collections</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-6 tracking-wide text-sm uppercase text-foreground">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/search" className="hover:text-primary transition-colors">Search</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-6 tracking-wide text-sm uppercase text-foreground">Account</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/auth/login" className="hover:text-primary transition-colors">Login / Register</Link></li>
                <li><Link href="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>&copy; 2026 TWT. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}