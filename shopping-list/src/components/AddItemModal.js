import React, { useState } from "react";

function AddItemModal({ onClose, onAddItem }) {
  const [itemName, setItemName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName.trim()) {
      onAddItem(itemName);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add new item</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="add-item-form">
            <input
              type="text"
              placeholder="Enter item name..."
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="button-primary">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;