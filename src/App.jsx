import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NormalOrder from './pages/NormalOrder';
import Preferences from "./pages/Preferences.jsx";
import Account from "./pages/Account.jsx";
import CartPage from './pages/CartPage.jsx';
import QuickOrder from "./pages/QuickOrder.jsx";
import QuickQuestionary from "./pages/QuickQuestionary.jsx";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/normalorder" element={<NormalOrder />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/preferences" element={<Preferences />} /> {/* Questionnaire page */}
        <Route path="/account" element={<Account />} />
        <Route path="/quickorder" element={<QuickOrder />} />
        <Route path="/quickquestionary" element={<QuickQuestionary />} />
    </Routes>
  );
}

export default App;
