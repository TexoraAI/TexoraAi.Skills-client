import { useState } from "react";

const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyCategory = { name: "", slug: "", displayOrder: 1, status: "active" };

export default function CategoryManagement({ categories, onCategoriesChange }) {
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyCategory);
  const [errors, setErrors] = useState({});

  const openAdd = () => {
    setForm({ ...emptyCategory, displayOrder: categories.length + 1 });
    setErrors({});
    setSelected(null);
    setModal("add");
  };

  const openEdit = (cat) => {
    setForm({ ...cat });
    setErrors({});
    setSelected(cat);
    setModal("edit");
  };

  const openDelete = (cat) => {
    setSelected(cat);
    setModal("delete");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Category name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (modal === "add") {
      const newCat = { ...form, id: Date.now() };
      onCategoriesChange([...categories, newCat]);
    } else {
      onCategoriesChange(categories.map(c => c.id === selected.id ? { ...selected, ...form } : c));
    }
    setModal(null);
  };

  const handleDelete = () => {
    onCategoriesChange(categories.filter(c => c.id !== selected.id));
    setModal(null);
  };

  const handleNameChange = (val) => {
    setForm(f => ({ ...f, name: val, slug: generateSlug(val) }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Category Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage categories used across featured programs</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <span>+</span> Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">🏷️</div>
          <h3 className="font-semibold text-gray-700 mb-1">No categories yet</h3>
          <p className="text-sm text-gray-400 mb-4">Create categories to organize your programs</p>
          <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Add First Category</button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-bold">
                        {cat.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-100 text-gray-600 w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold">{cat.displayOrder}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cat.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                      {cat.status === "active" ? "● Active" : "● Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="Edit">✏️</button>
                      <button onClick={() => openDelete(cat)} className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-lg">{modal === "add" ? "Add Category" : "Edit Category"}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Data Science"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Slug <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-generated"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 ${errors.slug ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                <p className="text-xs text-gray-400 mt-1">URL-friendly identifier (auto-generated from name)</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={form.displayOrder}
                    onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setModal(null)} className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                {modal === "add" ? "Create Category" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal === "delete" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">🗑</div>
              <h3 className="font-bold text-gray-900 text-lg">Delete Category</h3>
              <p className="text-sm text-gray-500 mt-1">Are you sure you want to delete <span className="font-semibold">"{selected?.name}"</span>? This cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}