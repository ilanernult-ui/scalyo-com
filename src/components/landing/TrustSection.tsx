import { Shield, Lock, Eye, Server, CheckCircle, FileCheck } from "lucide-react";

const trustPoints = [
  {
    icon: Lock,
    title: "Chiffrement de Bout en Bout",
    description: "Toutes vos données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Aucune donnée en clair.",
  },
  {
    icon: Shield,
    title: "Conforme RGPD",
    description: "Nous respectons le Règlement Général sur la Protection des Données. Vos données restent en Europe.",
  },
  {
    icon: Eye,
    title: "Transparence Totale",
    description: "Vos données ne sont jamais vendues ni partagées. Vous gardez le contrôle total sur vos informations.",
  },
  {
    icon: Server,
    title: "Intégrations Sécurisées",
    description: "Connexions OAuth 2.0, tokens d'accès limités et permissions granulaires pour chaque intégration.",
  },
  {
    icon: CheckCircle,
    title: "Audits de Sécurité",
    description: "Tests de pénétration réguliers et audits de sécurité par des experts indépendants certifiés.",
  },
  {
    icon: FileCheck,
    title: "Vous Gardez le Contrôle",
    description: "Exportez ou supprimez vos données à tout moment. Pas de verrouillage fournisseur, pas de piège.",
  },
];

const TrustSection = () => {
  return (
    <section id="security" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 mb-6">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Sécurité & Confiance</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Vos Données Sont Protégées
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Nous savons que vous connectez des données sensibles. C'est pourquoi la sécurité est au cœur de notre plateforme.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {trustPoints.map((point, i) => (
            <div
              key={point.title}
              className="rounded-2xl border border-accent/10 gradient-trust p-6 animate-fade-in hover:border-accent/20 transition-colors"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="rounded-xl bg-accent/10 p-3 w-fit mb-4">
                <point.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
