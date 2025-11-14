export function Footer() {
  return (
    <footer className="bg-[#1D1D1B] border-t border-primary/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-display font-black text-2xl text-primary mb-2">
            MELRING
          </p>
          <p className="font-body text-white/60 text-sm">
            © {new Date().getFullYear()} MELRING. Tous droits réservés.
          </p>
          <p className="font-body text-white/40 text-xs mt-2">
            Coaching par la boxe - Dépassement, Puissance, Engagement
          </p>
        </div>
      </div>
    </footer>
  );
}
