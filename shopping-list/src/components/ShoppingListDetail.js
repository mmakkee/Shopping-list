import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CURRENT_USER_ID, allUsers } from "../data/mockData";
import MembersModal from "./MembersModal";
import AddItemModal from "./AddItemModal";

function ShoppingListDetail({ lists, setLists }) {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("unresolved");
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const list = lists.find((l) => l.id === listId);

  const updateList = (updatedList) => {
    setLists(lists.map((l) => (l.id === listId ? updatedList : l)));
  };

  const handleAddItem = (newItemName) => {
    if (newItemName.trim() === "") return;

    const newItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      solved: false,
    };

    updateList({
      ...list,
      items: [...list.items, newItem],
    });
  };

  const handleMarkSolved = (itemId) => {
    updateList({
      ...list,
      items: list.items.map((item) =>
        item.id === itemId ? { ...item, solved: true } : item
      ),
    });
  };

  const handleDeleteItem = (itemId) => {
    updateList({
      ...list,
      items: list.items.filter((item) => item.id !== itemId),
    });
  };

  const handleChangeName = () => {
    const newName = prompt("Zadejte nový název seznamu:", list.name);
    if (newName && newName.trim() !== "") {
      updateList({ ...list, name: newName });
    }
  };

  const handleRemoveMember = (memberId) => {
    const updatedMembers = list.members.filter((id) => id !== memberId);
    if (memberId === CURRENT_USER_ID) {
      if (!window.confirm("Opravdu chcete opustit tento seznam?")) {
        return;
      }
      updateList({ ...list, members: updatedMembers });
      setIsMembersModalOpen(false);
      navigate("/");
    } else {
      if (!window.confirm("Opravdu chcete odebrat tohoto člena?")) {
        return;
      }
      updateList({ ...list, members: updatedMembers });
    }
  };

  const handleAddMember = (memberName) => {
    const userEntry = Object.entries(allUsers).find(
      ([id, user]) => user.name.toLowerCase() === memberName.toLowerCase()
    );

    if (!userEntry) {
      alert("User not found.");
      return;
    }

    const userId = userEntry[0];

    if (list.members.includes(userId)) {
      alert("User is already a member of this list.");
      return;
    }

    updateList({
      ...list,
      members: [...list.members, userId],
    });
  };

  if (!list || !list.members.includes(CURRENT_USER_ID)) {
    return (
      <div className="content">
        Seznam nebyl nalezen nebo k němu nemáte přístup.
      </div>
    );
  }

  const isOwner = list.owner === CURRENT_USER_ID;

  const filteredItems = list.items.filter((item) => {
    if (filter === "unresolved") {
      return !item.solved;
    }
    return true;
  });

  return (
    <>
      <div
        className="header"
        style={{ justifyContent: "flex-start", gap: "20px" }}
      >
        <Link to="/" className="button button-secondary">
          &larr; Back
        </Link>
        <h2>{list.name}</h2>
        {isOwner && (
          <button className="button-secondary" onClick={handleChangeName}>
            Change
          </button>
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
            <div
              key={item.id}
              className={`item-row ${item.solved ? "solved" : ""}`}
            >
              <span>{item.name}</span>
              <div className="item-row-actions">
                {!item.solved && (
                  <button
                    className="button-secondary"
                    onClick={() => handleMarkSolved(item.id)}
                  >
                    ✓ Mark solved
                  </button>
                )}
                <button
                  className="button-danger"
                  onClick={() => handleDeleteItem(item.id)}
                >
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