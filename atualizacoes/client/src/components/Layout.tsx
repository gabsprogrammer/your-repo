import { Link, useLocation } from "wouter";

import { Phone, Mail, Instagram, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Sobre Nós", href: "/sobre" },
    { name: "Produtos", href: "/produtos" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans aurora-bg">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm hidden md:block">
        <div className="container flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> (81) 9 9701-2344
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> madureirasegurospe@gmail.com
            </span>
          </div>
          <div className="flex gap-4">
            <a href="https://instagram.com/madureiracorretora" target="_blank" rel="noreferrer" className="hover:text-white/80 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-header py-3 shadow-sm" : "bg-transparent py-5"
        }`}
      >
        <div className="container flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/images/logo.png" alt="Madureira Seguros" className="h-24 w-auto" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <span className={`text-sm font-medium cursor-pointer transition-colors hover:text-primary ${
                  location === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                }`}>
                  {link.name}
                </span>
              </Link>
            ))}

            <Link href="/cotacao">
              <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                Cotar Agora
              </Button>
            </Link>
          </nav>

{/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              
              <button 
                className="p-2 text-slate-600 dark:text-slate-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-border shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <span 
                  className="block py-2 text-base font-medium text-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </span>
              </Link>
            ))}
            <Link href="/cotacao">
              <Button className="w-full rounded-full mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                Cotar Agora
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <img src="/images/logo.png" alt="Madureira Seguros" className="h-12 w-auto brightness-0 invert opacity-80" />
            <p className="text-sm leading-relaxed max-w-xs">
              A corretora certa para lhe assegurar e estar sempre perto de você. Mais de 10 anos de experiência protegendo o que importa.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Home</span></Link></li>
              <li><Link href="/sobre"><span className="hover:text-white transition-colors cursor-pointer">Sobre Nós</span></Link></li>
              <li><Link href="/produtos"><span className="hover:text-white transition-colors cursor-pointer">Produtos</span></Link></li>
              <li><Link href="/contato"><span className="hover:text-white transition-colors cursor-pointer">Contato</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Produtos</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/cotacao"><span className="hover:text-white transition-colors cursor-pointer">Seguro Auto</span></Link></li>
              <li><Link href="/cotacao"><span className="hover:text-white transition-colors cursor-pointer">Seguro Residencial</span></Link></li>
              <li><Link href="/cotacao"><span className="hover:text-white transition-colors cursor-pointer">Seguro de Vida</span></Link></li>
              <li><Link href="/cotacao"><span className="hover:text-white transition-colors cursor-pointer">Seguro Empresarial</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Contato</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <span>(81) 9 9701-2344</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <span>madureirasegurospe@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="w-5 h-5 text-primary mt-0.5" />
                <span>@madureiracorretora</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Madureira Seguros. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
