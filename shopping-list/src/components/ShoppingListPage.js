import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CURRENT_USER_ID, CURRENT_USER_NAME } from "../data/mockData";
import CreateListModal from "./CreateListModal";
import { api } from "../utils/api";

function ShoppingListPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showArchived, setShowArchived] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load data
  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const data = await api.getLists();
      setLists(data);
      setError(null);
    } catch (err) {
      setError("Error loading lists.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleCreateList = async (newListName) => {
    try {
      setLoading(true);
      await api.createList(newListName);
      await loadLists();
      setIsCreateModalOpen(false);
    } catch (err) {
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm("Delete this list?")) {
      try {
        await api.deleteList(listId);
        setLists((prev) => prev.filter((l) => l.id !== listId));
      } catch (err) {
        alert("Error deleting list.");
      }
    }
  };

  const handleToggleArchive = async (listId) => {
    try {
      await api.toggleArchiveList(listId);
      loadLists();
    } catch (err) {
      alert("Error changing archive state.");
    }
  };

  // Render logic
  if (loading && lists.length === 0) return <div className="loading-state">Loading lists...</div>;
  if (error) return <div className="error-state">{error} <button onClick={loadLists}>Retry</button></div>;

  const visibleLists = lists.filter(
    (list) =>
      list.members.includes(CURRENT_USER_ID) &&
      list.archived === showArchived
  );

  const getOwnerName = (list) => {
    return list.owner === CURRENT_USER_ID ? CURRENT_USER_NAME : "Sarah";
  };

  return (
    <>
      <div className="header">
        <h1>🛒 Shopping lists</h1>
        <button
          className="button-primary"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={loading}
        >
          + Create new list
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${!showArchived ? "active" : ""}`}
          onClick={() => setShowArchived(false)}
        >
          Active
        </button>
        <button
          className={`tab-button ${showArchived ? "active" : ""}`}
          onClick={() => setShowArchived(true)}
        >
          Archive
        </button>
      </div>

      <div className="content">
        <div className="tile-grid">
          {visibleLists.map((list) => {
            const isOwner = list.owner === CURRENT_USER_ID;
            return (
              <div key={list.id} className="list-tile">
                <div className="list-tile-content">
                  <Link
                    to={`/list/${list.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h3>{list.name}</h3>
                  </Link>
                  <p>
                    owner: {getOwnerName(list)}
                    <br />
                    members: {list.members.length}
                  </p>
                </div>
                <div className="list-tile-actions">
                  {isOwner && (
                    <button
                      className="button-icon"
                      title={list.archived ? "Restore" : "Archive"}
                      onClick={() => handleToggleArchive(list.id)}
                    >
                      {list.archived ? "🔄" : "🗄️"}
                    </button>
                  )}
                  {isOwner && (
                    <button
                      className="button-icon"
                      title="Delete"
                      onClick={() => handleDeleteList(list.id)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateListModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateList}
        />
      )}
    </>
  );
}

export default ShoppingListPage;