import React from "react";
import { Routes, Route } from "react-router-dom";
import ShoppingListPage from "./components/ShoppingListPage";
import ShoppingListDetail from "./components/ShoppingListDetail";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<ShoppingListPage />} />
        <Route path="/list/:listId" element={<ShoppingListDetail />} />
      </Routes>
    </div>
  );
}

export default App;