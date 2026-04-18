"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Sun, Moon, Menu, X, Globe, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleCart } from "@/features/cart/store/cartSlice";
import { setLanguage } from "@/store/languageSlice";
import { t } from "@/lib/i18n";
import { Language } from "@/lib/types";

const langs: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
];

export function Navbar() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const lang = useAppSelector((s) => s.language.current);
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDark = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setDark(isDark);
    localStorage.setItem("simba-theme", isDark ? "dark" : "light");
  };

  const navLinks = [
    { href: "/", label: t(lang, "home") },
    { href: "/products", label: t(lang, "products") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-background border-b border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-base leading-none">S</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-bold text-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Simba
              </p>
              <p className="text-xs text-primary font-medium leading-tight -mt-0.5">
                Supermarket
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Language switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1 text-sm"
              >
                <Globe size={16} />
                <span className="text-xs uppercase font-semibold">{lang}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-2xl shadow-xl p-1 min-w-[140px] animate-fade-in">
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        dispatch(setLanguage(l.code));
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-muted transition-colors ${
                        lang === l.code ? "text-primary font-semibold" : "text-foreground/70"
                      }`}
                    >
                      <span>{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin link */}
            <Link
              href="/admin"
              className="hidden sm:flex p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Admin"
            >
              <Shield size={18} />
            </Link>

            {/* Cart button */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 rounded-xl bg-primary hover:brightness-110 text-primary-foreground transition-all duration-200 active:scale-95 shadow-md shadow-primary/30"
              aria-label="Open cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce-in">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground"
            >
              <Shield size={16} /> Admin Dashboard
            </Link>
            <div className="px-4 py-2 flex gap-2">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { dispatch(setLanguage(l.code)); setMenuOpen(false); }}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold border ${lang === l.code ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
                >
                  {l.flag} {l.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
