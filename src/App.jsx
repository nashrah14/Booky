import { Toaster } from "@/components/Toaster";
import { Sonner } from "@/components/Sonner";
import { TooltipProvider } from "@/components/InlineComponents";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Discover from "./pages/Discover";
import MyBooks from "./pages/MyBooks";
import Lists from "./pages/Lists";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/my-books" element={<MyBooks />} />
                <Route path="/lists" element={<Lists />} />
                <Route path="/community" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
