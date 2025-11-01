import React, { useState } from "react";

function CreateListModal({ onClose, onCreate }) {
  const [listName, setListName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listName.trim()) {
      onCreate(listName);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create new shopping list</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="add-item-form">
            <input
              type="text"
              placeholder="Enter list name..."
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="button-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateListModal;