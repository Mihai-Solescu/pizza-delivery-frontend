import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NormalOrder from './pages/NormalOrder';
import Preferences from "./pages/Preferences.jsx";
import Account from "./pages/Account.jsx";
import CartPage from './pages/CartPage.jsx';
import QuickOrder from "./pages/QuickOrder.jsx";
import DeliveryStatusPage from './pages/DeliveryStatus.jsx'; 
import EarningsPage from './pages/Earnings.jsx';
import DeliveryPersonnelManagement from './pages/DeliveryPersonnelManagement.jsx';
import DeliveryPersonDashboard from './pages/DeliveryPersonDashboard.jsx';
import RestaurantDashboard from './pages/RestaurantDashboard.jsx';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/normalorder" element={<NormalOrder />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/account" element={<Account />} />
        <Route path="/quickorder" element={<QuickOrder />} />
        <Route path="/deliverystatus" element={<DeliveryStatusPage />} />
        <Route path="/deliverypersonnel" element={<DeliveryPersonnelManagement />} />
        <Route path="/earnings" element={<EarningsPage />} />
        <Route path="/deliverypersondashboard" element={<DeliveryPersonDashboard/>} />
        <Route path="/restaurantdashboard" element={<RestaurantDashboard/>} />
    </Routes>
  );
}

export default App;
