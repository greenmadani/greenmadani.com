import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { PageSkeleton } from "@/components/page-skeleton";

const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const Businesses = lazy(() => import("@/pages/businesses"));
const BusinessDetail = lazy(() => import("@/pages/business-detail"));
const Products = lazy(() => import("@/pages/products"));
const ProductDetail = lazy(() => import("@/pages/product-detail"));
const Sustainability = lazy(() => import("@/pages/sustainability"));
const News = lazy(() => import("@/pages/news"));
const NewsDetail = lazy(() => import("@/pages/news-detail"));
const Careers = lazy(() => import("@/pages/careers"));
const Contact = lazy(() => import("@/pages/contact"));
const PrivacyPage = lazy(() => import("@/pages/privacy"));
const TermsPage = lazy(() => import("@/pages/terms"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AdminLayout = lazy(() => import("@/pages/admin/layout"));
const AdminLogin = lazy(() => import("@/pages/admin/login"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminSettings = lazy(() => import("@/pages/admin/settings"));
const AdminBusinesses = lazy(() => import("@/pages/admin/manage").then(m => ({ default: m.AdminBusinesses })));
const AdminProducts = lazy(() => import("@/pages/admin/manage").then(m => ({ default: m.AdminProducts })));
const AdminNews = lazy(() => import("@/pages/admin/manage").then(m => ({ default: m.AdminNews })));
const AdminJobs = lazy(() => import("@/pages/admin/manage").then(m => ({ default: m.AdminJobs })));
const AdminContacts = lazy(() => import("@/pages/admin/inquiries").then(m => ({ default: m.AdminContacts })));
const AdminBizInquiries = lazy(() => import("@/pages/admin/inquiries").then(m => ({ default: m.AdminBizInquiries })));
const AdminCategories = lazy(() => import("@/pages/admin/categories"));
const AdminApplications = lazy(() => import("@/pages/admin/applications"));
const AdminMediaPage = lazy(() => import("@/pages/admin/media-page"));

function SuspenseWrapper({ component: Component }: { component: React.LazyExoticComponent<any> }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  );
}

function AnimatedPage({ component: Component }: { component: React.LazyExoticComponent<any> }) {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <SuspenseWrapper component={Component} />
      </motion.div>
    </AnimatePresence>
  );
}

const queryClient = new QueryClient();

function PublicRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/"><AnimatedPage component={Home} /></Route>
        <Route path="/about"><AnimatedPage component={About} /></Route>
        <Route path="/businesses/:slug"><AnimatedPage component={BusinessDetail} /></Route>
        <Route path="/businesses"><AnimatedPage component={Businesses} /></Route>
        <Route path="/products/:id"><AnimatedPage component={ProductDetail} /></Route>
        <Route path="/products"><AnimatedPage component={Products} /></Route>
        <Route path="/sustainability"><AnimatedPage component={Sustainability} /></Route>
        <Route path="/news/:slug"><AnimatedPage component={NewsDetail} /></Route>
        <Route path="/news"><AnimatedPage component={News} /></Route>
        <Route path="/careers"><AnimatedPage component={Careers} /></Route>
        <Route path="/contact"><AnimatedPage component={Contact} /></Route>
        <Route path="/privacy"><AnimatedPage component={PrivacyPage} /></Route>
        <Route path="/terms"><AnimatedPage component={TermsPage} /></Route>
        <Route><AnimatedPage component={NotFound} /></Route>
      </Switch>
    </Layout>
  );
}

function AdminRoutes() {
  return (
    <Switch>
      <Route path="/admin/login"><SuspenseWrapper component={AdminLogin} /></Route>
      <Route>
        <Suspense fallback={<PageSkeleton />}>
          <AdminLayout>
            <Switch>
              <Route path="/admin"><SuspenseWrapper component={AdminDashboard} /></Route>
              <Route path="/admin/businesses"><SuspenseWrapper component={AdminBusinesses} /></Route>
              <Route path="/admin/products"><SuspenseWrapper component={AdminProducts} /></Route>
              <Route path="/admin/news"><SuspenseWrapper component={AdminNews} /></Route>
              <Route path="/admin/jobs"><SuspenseWrapper component={AdminJobs} /></Route>
              <Route path="/admin/inquiries"><AdminInquiriesPage /></Route>
              <Route path="/admin/categories"><SuspenseWrapper component={AdminCategories} /></Route>
              <Route path="/admin/applications"><SuspenseWrapper component={AdminApplications} /></Route>
              <Route path="/admin/media"><SuspenseWrapper component={AdminMediaPage} /></Route>
              <Route path="/admin/settings"><SuspenseWrapper component={AdminSettings} /></Route>
              <Route><SuspenseWrapper component={AdminDashboard} /></Route>
            </Switch>
          </AdminLayout>
        </Suspense>
      </Route>
    </Switch>
  );
}

function AdminInquiriesPage() {
  return (
    <div className="space-y-8">
      <SuspenseWrapper component={AdminContacts} />
      <SuspenseWrapper component={AdminBizInquiries} />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin">
        <AdminRoutes />
      </Route>
      <Route path="/admin/:rest*">
        <AdminRoutes />
      </Route>
      <Route>
        <PublicRoutes />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
