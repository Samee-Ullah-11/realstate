import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/public/Home';
import Properties from './pages/public/Properties';
import PropertyDetail from './pages/public/PropertyDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import { Privacy, Terms } from './pages/public/Legal';
import NotFound from './pages/public/NotFound';

// Admin and the style guide are code-split so public visitors never load them.
const StyleGuide = lazy(() => import('./pages/StyleGuide'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const Login = lazy(() => import('./pages/admin/Login'));
const AdminProperties = lazy(() => import('./pages/admin/Properties'));
const PropertyForm = lazy(() => import('./pages/admin/PropertyForm'));
const AdminInquiries = lazy(() => import('./pages/admin/Inquiries'));
const AdminTestimonials = lazy(() => import('./pages/admin/Testimonials'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminPassword = lazy(() => import('./pages/admin/Password'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:slug" element={<PropertyDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/style-guide" element={<StyleGuide />} />

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProperties />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="properties/:id" element={<PropertyForm />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="password" element={<AdminPassword />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
