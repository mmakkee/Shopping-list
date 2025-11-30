import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CURRENT_USER_ID, allUsers } from "../data/mockData";
import MembersModal from "./MembersModal";
import AddItemModal from "./AddItemModal";
import { api } from "../utils/api";

function ShoppingListDetail() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("unresolved");
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // Load detail
  const loadListDetail = useCallback(async () => {
    try {
      const data = await api.getListDetail(listId);
      setList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    loadListDetail();
  }, [loadListDetail]);

  // Handlers
  const handleAddItem = async (newItemName) => {
    if (newItemName.trim() === "") return;
    try {
      await api.addItem(listId, newItemName);
      loadListDetail(); 
    } catch (err) {
      alert("Error adding item.");
    }
  };

  const handleMarkSolved = async (itemId) => {
    setList(prev => ({
        ...prev,
        items: prev.items.map(i => i.id === itemId ? {...i, solved: true} : i)
    }));
    
    try {
      await api.toggleItemSolved(listId, itemId);
    } catch(err) {
        loadListDetail();
    }
  };

  const handleDeleteItem = async (itemId) => {
    if(!window.confirm("Delete item?")) return;
    
    setList(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== itemId)
    }));

    try {
      await api.deleteItem(listId, itemId);
    } catch (err) {
        loadListDetail();
    }
  };

  const handleChangeName = async () => {
    const newName = prompt("Enter new list name:", list.name);
    if (newName && newName.trim() !== "") {
      setList(prev => ({ ...prev, name: newName }));
      await api.updateListName(listId, newName);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (memberId === CURRENT_USER_ID) {
      if (!window.confirm("Leave list?")) return;
      await api.manageMember(listId, memberId, 'remove');
      navigate("/");
    } else {
      if (!window.confirm("Remove member?")) return;
      await api.manageMember(listId, memberId, 'remove');
      loadListDetail();
    }
  };

  const handleAddMember = async (memberName) => {
    const users = await api.getAllUsers();
    const userEntry = Object.entries(users).find(
      ([id, user]) => user.name.toLowerCase() === memberName.toLowerCase()
    );

    if (!userEntry) {
      alert("User not found.");
      return;
    }
    const userId = userEntry[0];

    if (list.members.includes(userId)) {
      alert("User is already a member.");
      return;
    }

    await api.manageMember(listId, userId, 'add');
    loadListDetail();
  };

  // Render logic
  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">Error: {error} <Link to="/">Back</Link></div>;
  if (!list) return null;

  const isOwner = list.owner === CURRENT_USER_ID;

  const filteredItems = list.items.filter((item) => {
    if (filter === "unresolved") return !item.solved;
    return true;
  });

  return (
    <>
      <div className="header" style={{ justifyContent: "flex-start", gap: "20px" }}>
        <Link to="/" className="button button-secondary">&larr; Back</Link>
        <h2>{list.name}</h2>
        {isOwner && (
          <button className="button-secondary" onClick={handleChangeName}>Change</button>
        )}
        <button
          className="button-secondary"
          style={{ marginLeft: "auto" }}
          onClick={() => setIsMembersModalOpen(true)}
        >
          Show members ({list.members.length})
        </button>
      </div>

      <div className="content">
        <button
          className="button-primary add-item-button"
          onClick={() => setIsAddItemModalOpen(true)}
        >
          + Add New Item
        </button>

        <div className="item-list-header">
          <h3>List of Items ({filteredItems.length})</h3>
          <div className="tabs">
            <button
              className={`tab-button ${filter === "unresolved" ? "active" : ""}`}
              onClick={() => setFilter("unresolved")}
            >
              Unresolved only
            </button>
            <button
              className={`tab-button ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Show all
            </button>
          </div>
        </div>

        <div className="item-list">
          {filteredItems.map((item) => (
            <div key={item.id} className={`item-row ${item.solved ? "solved" : ""}`}>
              <span>{item.name}</span>
              <div className="item-row-actions">
                {!item.solved && (
                  <button className="button-secondary" onClick={() => handleMarkSolved(item.id)}>
                    ✓ Mark solved
                  </button>
                )}
                <button className="button-danger" onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isMembersModalOpen && (
        <MembersModal
          list={list}
          allUsers={allUsers}
          currentUser={CURRENT_USER_ID}
          isOwner={isOwner}
          onClose={() => setIsMembersModalOpen(false)}
          onRemoveMember={handleRemoveMember}
          onAddMember={handleAddMember}
        />
      )}

      {isAddItemModalOpen && (
        <AddItemModal
          onClose={() => setIsAddItemModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}
    </>
  );
}

export default ShoppingListDetail;