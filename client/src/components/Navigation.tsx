import { useState, useEffect } from "react";
import { Menu, X, Instagram, Settings } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Accueil", id: "hero" },
    { label: "Services", id: "services" },
    { label: "Tarifs", id: "pricing" },
    { label: "Team-Building", id: "team-building" },
    { label: "Planning", id: "enhanced-booking" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#1D1D1B] shadow-lg"
            : "bg-[#1D1D1B]/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-white font-display font-black text-2xl tracking-tight hover-elevate active-elevate-2 transition-colors"
              data-testid="button-logo"
            >
              MELRING
            </button>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-white/90 hover:text-primary font-body font-medium text-sm transition-colors relative group"
                  data-testid={`link-nav-${link.id}`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
              
              <div className="flex items-center gap-3 ml-4 border-l border-white/20 pl-4">
                <Link
                  href="/admin"
                  className="text-white/70 hover:text-primary transition-colors hover-elevate active-elevate-2"
                  aria-label="Administration"
                >
                  <Settings className="w-5 h-5" />
                </Link>
                <a
                  href="https://www.instagram.com/melring.coaching/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-primary transition-colors hover-elevate active-elevate-2"
                  data-testid="link-instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@melring.coaching"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-primary transition-colors hover-elevate active-elevate-2"
                  data-testid="link-tiktok"
                  aria-label="TikTok"
                >
                  <SiTiktok className="w-4 h-4" />
                </a>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-[#1D1D1B]/95 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-20 left-0 right-0 bg-[#1D1D1B] border-t border-primary/30 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left text-white/90 hover:text-primary font-body font-medium text-lg py-3 transition-colors border-b border-white/10 hover-elevate active-elevate-2"
                  data-testid={`link-mobile-nav-${link.id}`}
                >
                  {link.label}
                </button>
              ))}
              
              <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/10">
                <Link
                  href="/admin"
                  className="text-white/70 hover:text-primary transition-colors"
                  aria-label="Administration"
                >
                  <Settings className="w-6 h-6" />
                </Link>
                <a
                  href="https://www.instagram.com/melring.coaching/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-primary transition-colors"
                  data-testid="link-mobile-instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://www.tiktok.com/@melring.coaching"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-primary transition-colors"
                  data-testid="link-mobile-tiktok"
                  aria-label="TikTok"
                >
                  <SiTiktok className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
