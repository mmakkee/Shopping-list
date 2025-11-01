import React, { useState } from "react";

function MembersModal({
  list,
  allUsers,
  currentUser,
  isOwner,
  onClose,
  onRemoveMember,
  onAddMember,
}) {
  const [newMemberName, setNewMemberName] = useState("");

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      onAddMember(newMemberName);
      setNewMemberName("");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Members</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {list.members.map((memberId) => {
            const member = allUsers[memberId] || { name: "Unknown user" };
            const isSelf = memberId === currentUser;
            const isThisMemberTheOwner = memberId === list.owner;

            const showRemoveButton =
              (isOwner && !isSelf) || (!isOwner && isSelf);

            return (
              <div key={memberId} className="member-item">
                <span className="member-name">
                  {member.name}
                  {isThisMemberTheOwner && (
                    <span className="owner-tag">owner</span>
                  )}
                </span>
                {showRemoveButton && (
                  <button
                    className="button-danger"
                    onClick={() => onRemoveMember(memberId)}
                  >
                    {isSelf ? "Leave" : "Remove"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {isOwner && (
          <div className="modal-footer">
            <form onSubmit={handleAddSubmit} className="add-member-form">
              <input
                type="text"
                placeholder="Enter member name (e.g., Sarah)"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <button type="submit" className="button-primary">
                Add Member
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default MembersModal;