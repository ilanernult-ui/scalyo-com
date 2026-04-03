import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(`[ErrorBoundary:${this.props.name ?? "unknown"}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-center gap-3">
          <p className="text-sm font-semibold text-destructive">Une erreur inattendue s'est produite.</p>
          <p className="text-xs text-muted-foreground max-w-sm">
            {this.state.error?.message ?? "Erreur inconnue"}
          </p>
          <button
            className="text-xs font-medium text-primary hover:underline mt-1"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
