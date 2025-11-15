import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ShoppingListPage from "./components/ShoppingListPage";
import ShoppingListDetail from "./components/ShoppingListDetail";
import { initialLists } from "./data/mockData";

function App() {
  const [lists, setLists] = useState(initialLists);

  return (
    <div className="app-container">
      <Routes>
        <Route
          path="/"
          element={<ShoppingListPage lists={lists} setLists={setLists} />}
        />
        
        <Route
          path="/list/:listId"
          element={<ShoppingListDetail lists={lists} setLists={setLists} />}
        />
      </Routes>
    </div>
  );
}

export default App;