"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { SearchBar } from '../components/search-bar'
import { User2, ShoppingCart, Menu, Search } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState } from 'react'

const Navbar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/shop', label: 'SHOP' },
    { href: '/women', label: 'WOMEN' },
    { href: '/men', label: 'MEN' },
    { href: '/about', label: 'ABOUT' },
  ]

  return (
    <div>
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-6 w-6 text-foreground" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background border-r border-border">
                  <SheetHeader className="border-b border-border pb-4 mb-4">
                    <SheetTitle className="text-left">
                      <Link href="/" onClick={() => setIsOpen(false)} className="flex flex-col items-start">
                        <span className="text-2xl font-light tracking-[0.2em] text-foreground">TWT</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={
                            isActive
                              ? 'text-lg font-medium text-primary border-l-2 border-primary pl-4'
                              : 'text-lg text-muted-foreground hover:text-foreground transition-colors pl-4 border-l-2 border-transparent'
                          }
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                    <div className="pt-4 border-t border-border mt-4 space-y-4">
                      <Link
                        href="/auth/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground pl-4"
                      >
                        <User2 className="w-5 h-5" />
                        <span>Account</span>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-light tracking-[0.3em] text-foreground flex md:flex-row flex-col md:items-baseline items-center gap-1 md:gap-3">
                <span>TWT</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-12">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={
                        isActive
                          ? 'text-primary font-medium border-b border-primary pb-1 transition-all'
                          : 'text-muted-foreground hover:text-foreground transition-all text-sm tracking-[0.1em]'
                      }
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-2 md:space-x-6">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              <div className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Search className="w-5 h-5 text-foreground" />
                </Button>
              </div>

              <Link
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground transition-colors hidden md:block"
                aria-label="Account"
              >
                <User2 className="w-5 h-5" />
              </Link>
              <Link
                href="/cart"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
