import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-card">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="gradient-primary rounded-lg p-1.5">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">Axon</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 Axon AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
