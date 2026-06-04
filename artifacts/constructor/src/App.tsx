import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { Providers } from "@/components/providers";
import { useAuth } from "@/lib/auth-context";

import LandingPage from "@/components/landing/landing-page";
import LoginPage from "@/app/(app)/auth/login/page";
import RegisterPage from "@/app/(app)/auth/register/page";
import DashboardPage from "@/app/(app)/dashboard/page";
import GuidePage from "@/app/(app)/dashboard/guide/page";
import SettingsPage from "@/app/(app)/dashboard/settings/page";
import EditorPage from "@/app/(app)/editor/[projectId]/page";
import SitePage from "@/app/site/[siteId]/page";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--muted)]">Загрузка...</div>;
  if (!user) return <Redirect to="/auth/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={DashboardPage} />}
      </Route>
      <Route path="/dashboard/guide">
        {() => <ProtectedRoute component={GuidePage} />}
      </Route>
      <Route path="/dashboard/settings">
        {() => <ProtectedRoute component={SettingsPage} />}
      </Route>
      <Route path="/editor/:projectId">
        {() => <ProtectedRoute component={EditorPage} />}
      </Route>
      <Route path="/site/:siteId" component={SitePage} />
      <Route>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold">404</h1>
          <p className="text-[var(--muted)]">Страница не найдена</p>
          <a href="/" className="text-brand-600 hover:underline">На главную</a>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <Providers>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </Providers>
  );
}

export default App;
