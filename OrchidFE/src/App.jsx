import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route , Navigate , Outlet } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import NavBar from "./components/NavBar";
import DetailOrchid from "./components/DetailOrchid";
import Login from "./components/Login";
import Register from "./components/Register";
import CartPage from "./components/CartPage";
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import OrderHistoryPage from "./components/OrderHistoryPage";
import OrderDetailsPage from "./components/OrderDetailPage";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardOverview from "./pages/admin/DashboardOverview";
import ManageOrders from "./pages/admin/ManageOrder";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageOrchidPage from "./pages/admin/ManageOrchidPage";
import ManageAccounts from "./pages/admin/ManageAccountPage";
import ManageCategories from "./pages/admin/ManageCategories";
import { useLocation } from "react-router-dom";
const Layout = () => {
    const location = useLocation();
        const pathname = location.pathname;
    // Không hiển thị NavBar trên các trang của admin
    const hideNavBar = pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register';

    return (
        <>
            {!hideNavBar  && <NavBar />}
            <Outlet />
        </>
    );
};


function App() {
  return (
      <Routes>
        <Route element={<Layout />}>
            {/* === Các Route công khai (Ai cũng truy cập được) === */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
            {/* === Các Route của người dùng (Yêu cầu đăng nhập) === */}
            <Route element={<ProtectedRoute />}>
                {/* Chuyển / về /home */}
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/detail/:id" element={<DetailOrchid />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order-history" element={<OrderHistoryPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            </Route>
        </Route>
        
        {/* === Các Route của ADMIN (Yêu cầu vai trò ADMIN và không có NavBar chung) === */}
        <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="overview" replace />} /> 
                <Route path="overview" element={<DashboardOverview />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="orchids" element={<ManageOrchidPage />} />
                <Route path="accounts" element={<ManageAccounts />} />
                <Route path="categories" element={<ManageCategories />} />
            </Route>
        </Route>
        
        {/* Bạn có thể thêm một route cho trang không tìm thấy ở cuối */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
  );
}

export default App;