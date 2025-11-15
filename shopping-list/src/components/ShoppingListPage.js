import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CURRENT_USER_ID, CURRENT_USER_NAME } from "../data/mockData";
import CreateListModal from "./CreateListModal"; 
function ShoppingListPage({ lists, setLists }) {
 
  const [showArchived, setShowArchived] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

 
  const handleCreateList = (newListName) => {
    const newList = {
      id: `list-${Date.now()}`,
      name: newListName,
      owner: CURRENT_USER_ID,
      members: [CURRENT_USER_ID],
      archived: false,
      items: [],
    };
  
    setLists([newList, ...lists]);
    setIsCreateModalOpen(false);
  };

 
  const handleDeleteList = (listId) => {
    
    if (window.confirm("Opravdu chcete smazat tento seznam?")) {
      setLists(lists.filter((list) => list.id !== listId));
    }
  };


  const handleToggleArchive = (listId) => {
    setLists(
      lists.map((list) =>
       
        list.id === listId ? { ...list, archived: !list.archived } : list
      )
    );
  };
 
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
                      title={list.archived ? "Obnovit seznam" : "Archivovat seznam"}
                      onClick={() => handleToggleArchive(list.id)}
                    >

                      {list.archived ? "🔄" : "🗄️"}
                    </button>
                  )}
                 
                  
                  {isOwner && (
                    <button
                      className="button-icon"
                      title="Smazat"
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