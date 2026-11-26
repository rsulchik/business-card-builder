import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import StoreBoard from "./pages/StoreBoard";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import CoreCollection from "./pages/CoreCollection";
import SetsAndPairs from "./pages/SetsAndPairs";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { LanguageProvider } from "@/i18n";
import { CatalogProvider } from "@/context/CatalogContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CatalogProvider>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/promotion" element={<StoreBoard page="promotion" />} />
                  <Route path="/reviews" element={<StoreBoard page="reviews" />} />
                  <Route path="/events" element={<StoreBoard page="events" />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/collections/core" element={<CoreCollection />} />
                  <Route path="/collections/sets-and-pairs" element={<SetsAndPairs />} />
                  <Route path="/login" element={<AuthPage mode="login" />} />
                  <Route path="/register" element={<AuthPage mode="register" />} />
                  <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/admin" element={<Admin />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </CatalogProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
