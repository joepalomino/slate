export function formatDate(timestamp) {
  const d = new Date(timestamp);
  const time = d.toLocaleTimeString("en-US");
  return time.substr(0, 5) + time.slice(-2) + " | " + d.toLocaleDateString();
}

export function generateUID() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

export const collectionToArray = coll =>
  Object.keys(coll).map(key => coll[key]);

export const formatItem = (name, size, dueDate, listId) => ({
  id: generateUID(),
  timestamp: Date.now(),
  list: listId,
  dueDate,
  name,
  size
});

export const formatList = (name, slateId) => ({
  id: generateUID(),
  timestamp: Date.now(),
  slate: slateId,
  name,
  items: []
});

export const UpdatedSlate = (prevSlate, name, color) => ({
  ...prevSlate,
  name,
  color
});

export const saveToLocalStorage = (name, collection) => {
  localStorage.setItem(name, JSON.stringify(collection));
};
