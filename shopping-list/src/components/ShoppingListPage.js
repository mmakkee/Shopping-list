import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CURRENT_USER_ID, allUsers } from "../data/mockData";
import CreateListModal from "./CreateListModal";
import { api } from "../utils/api";

function ShoppingListPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showArchived, setShowArchived] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      setError("Failed to load lists.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        await api.deleteList(listId);
        setLists((prev) => prev.filter((l) => (l.id !== listId && l._id !== listId)));
        await loadLists();
      } catch (err) {
        alert("Error deleting list.");
      }
    }
  };

  const handleToggleArchive = async (list) => {
    try {
      const listId = list.id || list._id;
      await api.toggleArchiveList(listId, list.archived);
      loadLists();
    } catch (err) {
      alert("Error changing status.");
    }
  };

  if (loading && lists.length === 0) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error} <button onClick={loadLists}>Retry</button></div>;

  const visibleLists = lists.filter(
    (list) => {
      const members = list.members || [];
      return members.includes(CURRENT_USER_ID) && list.archived === showArchived;
    }
  );

  const getOwnerName = (ownerId) => {
    if (ownerId === CURRENT_USER_ID) return "You";
    if (allUsers[ownerId]) return allUsers[ownerId].name;
    return "Unknown User";
  };

  return (
    <>
      <div className="header">
        <h1>🛒 Shopping Lists</h1>
        <button
          className="button-primary"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={loading}
        >
          + Create List
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
          Archived
        </button>
      </div>

      <div className="content">
        <div className="tile-grid">
          {visibleLists.map((list) => {
            const listId = list.id || list._id;
            const isOwner = list.ownerId === CURRENT_USER_ID;
            return (
              <div key={listId} className="list-tile">
                <div className="list-tile-content">
                  <Link
                    to={`/list/${listId}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h3>{list.name}</h3>
                  </Link>
                  <p>
                    Owner: {getOwnerName(list.ownerId)}
                    <br />
                    Members: {list.members ? list.members.length : 0}
                  </p>
                </div>
                <div className="list-tile-actions">
                  {isOwner && (
                    <button
                      className="button-icon"
                      title={list.archived ? "Restore" : "Archive"}
                      onClick={() => handleToggleArchive(list)}
                    >
                      {list.archived ? "🔄" : "🗄️"}
                    </button>
                  )}
                  {isOwner && (
                    <button
                      className="button-icon"
                      title="Delete"
                      onClick={() => handleDeleteList(listId)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {visibleLists.length === 0 && (
             <p style={{textAlign: "center", color: "#ccc", padding: "20px"}}>
                 No lists found.
             </p>
        )}
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