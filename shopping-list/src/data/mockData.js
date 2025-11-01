export const CURRENT_USER_ID = "user1";
export const CURRENT_USER_NAME = "you";

export const allUsers = {
  user1: { name: "you" },
  user2: { name: "Sarah" },
  user3: { name: "Peter" },
};

export const initialLists = [
  {
    id: "list1",
    name: "Weekly Groceries",
    owner: "user1",
    members: ["user1", "user2", "user3"],
    archived: false,
    items: [
      { id: "item1", name: "Milk", solved: false },
      { id: "item2", name: "Bread", solved: true },
      { id: "item3", name: "Cheese", solved: false },
    ],
  },
  {
    id: "list2",
    name: "Party Supplies",
    owner: "user2",
    members: ["user2", "user1"],
    archived: false,
    items: [{ id: "item4", name: "Balloons", solved: false }],
  },
  {
    id: "list3",
    name: "Christmas Shopping",
    owner: "user1",
    members: ["user1"],
    archived: false,
    items: [],
  },
  {
    id: "list4",
    name: "Old Vacation List",
    owner: "user1",
    members: ["user1"],
    archived: true,
    items: [{ id: "item5", name: "Sunscreen", solved: true }],
  },
];