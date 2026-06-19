import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

// Public Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Businesses from "@/pages/businesses";
import BusinessDetail from "@/pages/business-detail";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Sustainability from "@/pages/sustainability";
import News from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import Careers from "@/pages/careers";
import Contact from "@/pages/contact";

// Admin Pages
import AdminLayout from "@/pages/admin/layout";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminSettings from "@/pages/admin/settings";
import { AdminBusinesses, AdminProducts, AdminNews, AdminJobs } from "@/pages/admin/manage";
import { AdminContacts, AdminBizInquiries } from "@/pages/admin/inquiries";

const queryClient = new QueryClient();

function PublicRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/businesses" component={Businesses} />
        <Route path="/businesses/:slug" component={BusinessDetail} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/sustainability" component={Sustainability} />
        <Route path="/news" component={News} />
        <Route path="/news/:slug" component={NewsDetail} />
        <Route path="/careers" component={Careers} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AdminRoutes() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route>
        <AdminLayout>
          <Switch>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/businesses" component={AdminBusinesses} />
            <Route path="/admin/products" component={AdminProducts} />
            <Route path="/admin/news" component={AdminNews} />
            <Route path="/admin/jobs" component={AdminJobs} />
            <Route path="/admin/inquiries" component={AdminInquiriesPage} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route component={AdminDashboard} />
          </Switch>
        </AdminLayout>
      </Route>
    </Switch>
  );
}

function AdminInquiriesPage() {
  return (
    <div className="space-y-8">
      <AdminContacts />
      <AdminBizInquiries />
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
