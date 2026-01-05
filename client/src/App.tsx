import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Cotacao from "./pages/Cotacao";
import Sobre from "./pages/Sobre";
import Produtos from "./pages/Produtos";
import Seguradoras from "./pages/Seguradoras";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cotacao" component={Cotacao} />
      <Route path="/sobre" component={Sobre} />
      <Route path="/produtos" component={Produtos} />
      <Route path="/seguradoras" component={Seguradoras} />
      <Route path="/contato" component={Home} /> {/* Placeholder - redireciona para Home */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
