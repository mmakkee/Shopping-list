import React from "react";
import { Routes, Route } from "react-router-dom";
import ShoppingListPage from "./components/ShoppingListPage";
import ShoppingListDetail from "./components/ShoppingListDetail";

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Hlavní cesta "/" zobrazí přehled seznamů */}
        <Route path="/" element={<ShoppingListPage />} />

        {/* Cesta "/list/:listId" zobrazí detail konkrétního seznamu */}
        {/* :listId je dynamický parametr, který si pak přečteme */}
        <Route path="/list/:listId" element={<ShoppingListDetail />} />
      </Routes>
    </div>
  );
}

export default App;