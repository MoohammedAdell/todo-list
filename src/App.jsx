import { useState, useEffect } from "react";

function App() {
  // تحميل البيانات من LocalStorage عند بداية التشغيل
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("travel-items");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // حفظ البيانات تلقائياً عند أي تغيير
  useEffect(() => {
    localStorage.setItem("travel-items", JSON.stringify(items));
  }, [items]);

  const handelAddItem = (item) => {
    setItems((items) => [...items, item]);
  };

  const handelDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handelToggle = (id) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const handleClearList = () => {
    const confirmed = window.confirm("Are you sure you want to delete all items? 🗑️");
    if (confirmed) setItems([]);
  };

  return (
    <div className="app">
      <Header />
      <Form onAddItem={handelAddItem} />
      <PackingList
        items={items}
        onDeleteItem={handelDelete}
        onToggleItem={handelToggle}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

const Header = () => {
  return <h1>TrekTrack ✈</h1>;
};

const Form = ({ onAddItem }) => {
  const [desc, setDesc] = useState("");
  const [select, setSelect] = useState(1);

  const handelSubmit = (e) => {
    e.preventDefault();
    if (!desc) return;

    const newItem = {
      id: Date.now(),
      desc,
      select,
      packed: false,
    };

    onAddItem(newItem);
    setDesc("");
    setSelect(1);
  };

  return (
    <form className="add-form" onSubmit={handelSubmit}>
      <h3>Pack your bags! 🎒</h3>
      <select value={select} onChange={(e) => setSelect(Number(e.target.value))}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        type="text"
        placeholder="What's next?..."
      />
      <button>Add Task</button>
    </form>
  );
};

const PackingList = ({ items, onDeleteItem, onToggleItem, onClearList }) => {
  const [sortBy, setSortBy] = useState("input");

  // منطق الترتيب (Advanced Sorting)
  let sortedItems;
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description") 
    sortedItems = [...items].sort((a, b) => a.desc.localeCompare(b.desc));
  if (sortBy === "status") 
    sortedItems = [...items].sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            key={item.id}
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>

      {/* أدوات التحكم المتقدمة */}
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by order</option>
          <option value="description">Sort by name</option>
          <option value="status">Sort by status</option>
        </select>
        <button onClick={onClearList}>Clear All</button>
      </div>
    </div>
  );
};

const Item = ({ item, onDeleteItem, onToggleItem }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through", opacity: 0.5 } : {}}>
        {item.select} {item.desc}
      </span>
      <button onClick={() => onDeleteItem(item.id)} style={{color: "#ff4b4b"}}>
        &times;
      </button>
    </li>
  );
};

const Stats = ({ items }) => {
  if (!items.length)
    return <footer className="stats"><em>Your list is empty, start planning! 🚀</em></footer>;

  const total = items.length;
  const packedItems = items.filter((i) => i.packed).length;
  const percentage = Math.round((packedItems / total) * 100);

  return (
    <footer className="stats">
      {percentage === 100 
        ? "Mission Accomplished! 🌍🔥" 
        : `📊 Progress: ${packedItems} of ${total} items (${percentage}%)`}
    </footer>
  );
};

export default App;