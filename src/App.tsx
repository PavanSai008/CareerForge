import { useEffect, useRef } from 'react';
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { dark } from '@clerk/themes';
import { Switch, Route, Redirect, useLocation, Router as WouterRouter } from 'wouter';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/not-found';
import Navbar from '@/components/Navbar';
import Landing from '@/pages/Landing';
import StartPath from '@/pages/StartPath';
import Quiz from '@/pages/Quiz';
import Results from '@/pages/Results';
import Account from '@/pages/Account';
import History from '@/pages/History';

const clerkPubKey: string =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ??
  (() => {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
  })();

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

const clerkAppearance = {
  theme: dark,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#7c6fff',
    colorForeground: '#f0f0ff',
    colorMutedForeground: '#a0a0c0',
    colorDanger: '#ef4444',
    colorBackground: '#0e0e18',
    colorInput: '#12121a',
    colorInputForeground: '#f0f0ff',
    colorNeutral: '#1e1e2e',
    fontFamily: '"Space Grotesk", system-ui, sans-serif',
    borderRadius: '12px',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#0e0e18] rounded-2xl w-[440px] max-w-full overflow-hidden border border-[#1e1e2e]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#f0f0ff]',
    headerSubtitle: 'text-[#a0a0c0]',
    socialButtonsBlockButtonText: 'text-[#f0f0ff]',
    formFieldLabel: 'text-[#a0a0c0]',
    footerActionLink: 'text-[#a99fff] hover:text-[#c4bcff]',
    footerActionText: 'text-[#a0a0c0]',
    dividerText: 'text-[#6060a0]',
    identityPreviewEditButton: 'text-[#a99fff]',
    formFieldSuccessText: 'text-[#6ee7b7]',
    alertText: 'text-[#fca5a5]',
    logoBox: 'mb-2',
    logoImage: 'h-9',
    socialButtonsBlockButton: 'border border-[#1e1e2e] bg-white/[0.03] hover:bg-white/[0.06]',
    formButtonPrimary:
      'bg-gradient-to-br from-[#7c6fff] to-[#a855f7] hover:opacity-90 text-white shadow-none',
    formFieldInput: 'bg-[#12121a] border border-[#1e1e2e] text-[#f0f0ff]',
    footerAction: 'bg-transparent',
    dividerLine: 'bg-[#1e1e2e]',
    alert: 'bg-[#ef444420] border border-[#ef444450]',
    otpCodeFieldInput: 'bg-[#12121a] border border-[#1e1e2e] text-[#f0f0ff]',
    formFieldRow: '',
    main: '',
  },
};

function SignInPage() {
  return (
    <div className="pf-quiz-page pf-quiz-centered">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="pf-quiz-page pf-quiz-centered">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

// Invalidates the QueryClient cache whenever the signed-in user changes, so
// stale per-user data (career history, API key status) never leaks across accounts.
function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function AppShell() {
  return (
    <div className="pathforge-app">
      <Navbar />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/start">
          <ProtectedRoute>
            <StartPath />
          </ProtectedRoute>
        </Route>
        <Route path="/quiz">
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        </Route>
        <Route path="/results">
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        </Route>
        <Route path="/account">
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        </Route>
        <Route path="/history">
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: 'Welcome back',
            subtitle: 'Sign in to continue forging your path',
          },
        },
        signUp: {
          start: {
            title: 'Create your account',
            subtitle: 'Start your personalized career roadmap',
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <AppShell />
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
