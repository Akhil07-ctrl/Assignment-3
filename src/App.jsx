import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import IngredientDetail from "./components/IngredientDetail";
import { CartProvider } from "./context/CartContext";
import "./App.css";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dish/:id/ingredients" element={<IngredientDetail />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
