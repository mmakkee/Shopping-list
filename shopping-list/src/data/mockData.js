export const CURRENT_USER_ID = "user123";
export const CURRENT_USER_NAME = "Mariya";

export const allUsers = {
  user123: { name: "Mariya (Owner)" },
  user789: { name: "Ivan (Member)" },
  user456: { name: "Petr (Stranger)" },
};

export const initialLists = [
  {
    id: "list1",
    name: "Weekly Groceries",
    owner: "user123",
    members: ["user123", "user789"],
    archived: false,
    items: [
      { id: "item1", name: "Milk", solved: false },
      { id: "item2", name: "Bread", solved: true },
    ],
  },
];