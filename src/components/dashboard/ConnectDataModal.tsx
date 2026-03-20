import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Database, Upload, FileSpreadsheet } from "lucide-react";

interface ConnectDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
}

const ConnectDataModal = ({ open, onOpenChange, serviceName }: ConnectDataModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Database className="h-6 w-6 text-primary" />
        </div>
        <DialogTitle className="text-center">Connecter vos données</DialogTitle>
        <DialogDescription className="text-center">
          Importez vos données pour activer {serviceName}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 my-2">
        <button className="w-full flex items-center gap-4 rounded-xl border border-border p-4 text-left hover:bg-secondary/50 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <Upload className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Importer un fichier CSV</p>
            <p className="text-xs text-muted-foreground">Glissez-déposez ou sélectionnez un fichier</p>
          </div>
        </button>

        <button className="w-full flex items-center gap-4 rounded-xl border border-border p-4 text-left hover:bg-secondary/50 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Importer un fichier Excel</p>
            <p className="text-xs text-muted-foreground">Formats .xlsx et .xls supportés</p>
          </div>
        </button>

        <button className="w-full flex items-center gap-4 rounded-xl border border-border p-4 text-left hover:bg-secondary/50 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <Database className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Connecter un logiciel</p>
            <p className="text-xs text-muted-foreground">QuickBooks, Sage, Pennylane…</p>
          </div>
        </button>
      </div>

      <p className="text-[11px] text-center text-muted-foreground">
        Vos données sont chiffrées et hébergées en France (RGPD).
      </p>
    </DialogContent>
  </Dialog>
);

export default ConnectDataModal;
