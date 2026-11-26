import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />
      <main className="min-h-[70vh] pt-[108px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
