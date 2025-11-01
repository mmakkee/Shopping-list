import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  initialLists,
  CURRENT_USER_ID,
  allUsers,
} from "../data/mockData";
import MembersModal from "./MembersModal";

function ShoppingListDetail() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [filter, setFilter] = useState("unresolved");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const foundList = initialLists.find((l) => l.id === listId);

    if (foundList && foundList.members.includes(CURRENT_USER_ID)) {
      setList(foundList);
    } else {
      setList(null);
    }
  }, [listId, navigate]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemName.trim() === "") return;

    const newItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      solved: false,
    };

    setList({
      ...list,
      items: [...list.items, newItem],
    });

    setNewItemName("");
  };

  const handleMarkSolved = (itemId) => {
    setList({
      ...list,
      items: list.items.map((item) =>
        item.id === itemId ? { ...item, solved: true } : item
      ),
    });
  };

  const handleDeleteItem = (itemId) => {
    setList({
      ...list,
      items: list.items.filter((item) => item.id !== itemId),
    });
  };

  const handleChangeName = () => {
    const newName = prompt("Zadejte nový název seznamu:", list.name);
    if (newName && newName.trim() !== "") {
      setList({ ...list, name: newName });
    }
  };

  const handleRemoveMember = (memberId) => {
    if (memberId === CURRENT_USER_ID) {
      if (!window.confirm("Opravdu chcete opustit tento seznam?")) {
        return;
      }
      setList({
        ...list,
        members: list.members.filter((id) => id !== memberId),
      });
      setIsModalOpen(false);
      navigate("/");
    } else {
      if (!window.confirm("Opravdu chcete odebrat tohoto člena?")) {
        return;
      }
      setList({
        ...list,
        members: list.members.filter((id) => id !== memberId),
      });
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

    setList({
      ...list,
      members: [...list.members, userId],
    });
  };

  if (!list) {
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
          onClick={() => setIsModalOpen(true)}
        >
          Show members ({list.members.length})
        </button>
      </div>

      <div className="content">
        <form className="add-item-form" onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="Enter item name..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <button type="submit" className="button-primary">
            + Add Item
          </button>
        </form>

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

      {isModalOpen && (
        <MembersModal
          list={list}
          allUsers={allUsers}
          currentUser={CURRENT_USER_ID}
          isOwner={isOwner}
          onClose={() => setIsModalOpen(false)}
          onRemoveMember={handleRemoveMember}
          onAddMember={handleAddMember}
        />
      )}
    </>
  );
}

export default ShoppingListDetail;