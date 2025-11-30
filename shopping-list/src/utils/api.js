import { initialLists, CURRENT_USER_ID } from "../data/mockData";

const USE_MOCK_API = false;
const BASE_URL = "http://localhost:3005";
const MOCK_DELAY = 50;

let mockDatabase = JSON.parse(JSON.stringify(initialLists));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  _fetch: async (url, options = {}) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "user123",
        ...options.headers,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.uuAppErrorMap ? JSON.stringify(errorData.uuAppErrorMap) : "Server Error");
    }
    return response.json();
  },

  getLists: async () => {
    if (USE_MOCK_API) {
      await sleep(MOCK_DELAY);
      return mockDatabase.filter(list => list.members.includes(CURRENT_USER_ID));
    }
    try {
      const data = await api._fetch("/list/list");
      return data.lists || data;
    } catch (e) {
      return [];
    }
  },

  getListDetail: async (listId) => {
    if (USE_MOCK_API) {
      await sleep(MOCK_DELAY);
      const list = mockDatabase.find((l) => l.id === listId);
      if (!list) throw new Error("Not found");
      return { ...list };
    }
    return await api._fetch(`/list/get?id=${listId}`);
  },

  createList: async (name) => {
    if (USE_MOCK_API) {
      await sleep(MOCK_DELAY);
      const newList = {
        id: `list-${Date.now()}`,
        name: name,
        ownerId: CURRENT_USER_ID,
        members: [CURRENT_USER_ID],
        archived: false,
        items: [],
      };
      mockDatabase.push(newList);
      return newList;
    }
    return await api._fetch("/list/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  updateListName: async (listId, newName) => {
    if (USE_MOCK_API) {
      await sleep(MOCK_DELAY);
      const list = mockDatabase.find((l) => l.id === listId);
      if (list) list.name = newName;
      return list;
    }
    return await api._fetch("/list/update", {
      method: "POST",
      body: JSON.stringify({ id: listId, name: newName }),
    });
  },

  deleteList: async (listId) => {
    if (USE_MOCK_API) {
      await sleep(MOCK_DELAY);
      mockDatabase = mockDatabase.filter((l) => l.id !== listId);
      return { success: true };
    }
    return await api._fetch("/list/delete", {
      method: "POST",
      body: JSON.stringify({ id: listId }),
    });
  },

  manageMember: async (listId, memberId, action) => {
    if (USE_MOCK_API) {
      await sleep(MOCK_DELAY);
      return {};
    }

    const endpoint = action === 'add' ? "/list/addMember" : "/list/removeMember";
    if (action === 'remove' && memberId === "user123") {
      return await api._fetch("/list/leaveList", {
        method: "POST",
        body: JSON.stringify({ listId }),
      });
    }
    return await api._fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ listId, memberId }),
    });
  },

  addItem: async (listId, itemName) => {
    if (USE_MOCK_API) {
      await sleep(MOCK_DELAY);
      const list = mockDatabase.find((l) => l.id === listId);
      if (list) {
        list.items.push({ id: `item-${Date.now()}`, name: itemName, solved: false });
      }
      return {};
    }
    return await api._fetch("/item/add", {
      method: "POST",
      body: JSON.stringify({ listId, text: itemName }),
    });
  },

  toggleItemSolved: async (listId, itemId) => {
    if (USE_MOCK_API) return {};
    return await api._fetch("/item/resolve", {
      method: "POST",
      body: JSON.stringify({ listId, itemId, solved: true }),
    });
  },

  deleteItem: async (listId, itemId) => {
    if (USE_MOCK_API) return {};
    return await api._fetch("/item/remove", {
      method: "POST",
      body: JSON.stringify({ listId, itemId }),
    });
  },

  toggleArchiveList: async (listId, currentStatus) => {
    return await api._fetch("/list/updateArchived", {
      method: "POST",
      body: JSON.stringify({ id: listId, archived: !currentStatus }),
    });
  },

  getAllUsers: async () => {
    return {
      user123: { name: "Mariya (Owner)" },
      user789: { name: "Ivan (Member)" },
      user456: { name: "Petr (Stranger)" },
    };
  }
};