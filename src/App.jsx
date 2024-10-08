import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NormalOrder from './pages/NormalOrder';
import Preferences from "./pages/Preferences.jsx";
import Account from "./pages/Account.jsx";
import QuickOrder from "./pages/QuickOrder.jsx";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/normalorder" element={<NormalOrder />} />
        <Route path="/preferences" element={<Preferences />} /> {/* Questionnaire page */}
        <Route path="/account" element={<Account />} />
        <Route path="/quickorder" element={<QuickOrder />} />
    </Routes>
  );
}

export default App;
