import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminGate } from "./components/AdminGate";
import { AdminLayout } from "./components/AdminLayout";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminMenu } from "./pages/AdminMenu";
import { AdminSettings } from "./pages/AdminSettings";
import { Home } from "./pages/Home";
import { Menu } from "./pages/Menu";
import { ReservationPage } from "./pages/Reservation";

export const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/menu"
            element={
              <AdminGate>
                <AdminLayout>
                  <AdminMenu />
                </AdminLayout>
              </AdminGate>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminGate>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </AdminGate>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
