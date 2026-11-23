import { addItem, deleteItem } from "./actions";
import { getStore } from "@/lib/store";

export default async function Home() {
  const items = await getStore().list("items", "-created_at");
  return (
    <>
      <h1>Items</h1>
      <form action={addItem} className="card">
        <label>
          Name <input name="name" required maxLength={500} />
        </label>
        <label>
          Note <input name="note" maxLength={500} />
        </label>
        <button type="submit">Add</button>
      </form>
      <ul className="list">
        {items.length === 0 && <li className="muted">No items yet.</li>}
        {items.map((item) => (
          <li key={item.id}>
            <strong>{String(item.name)}</strong> {String(item.note ?? "")}
            <form action={deleteItem} className="inline">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
