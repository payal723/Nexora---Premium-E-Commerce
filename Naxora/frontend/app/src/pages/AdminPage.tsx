import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Upload, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';
import { productAPI, uploadAPI, type AdminProductInput } from '@/lib/api';

interface BackendProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  brand?: string;
  images: { url: string; alt?: string }[];
  isActive: boolean;
}

const emptyForm: AdminProductInput = {
  name: '',
  description: '',
  price: 0,
  category: 'electronics',
  stock: 0,
  brand: 'Nexora',
  images: [],
  isActive: true,
};

export default function AdminPage() {
  const { user, authLoading } = useApp();

  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminProductInput>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === 'admin';

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productAPI.getProducts();
      setProducts(res.products as unknown as BackendProduct[]);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadProducts();
  }, [isAdmin, loadProducts]);

  // Still checking auth — avoid flashing "Access denied" before we know
  if (authLoading) {
    return (
      <div className="pt-24 pb-16 px-4 text-center text-[#a0a0b0]">
        <Loader2 className="animate-spin mx-auto mb-3" size={24} />
        Checking access…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-24 pb-16 px-4 text-center">
        <ShieldAlert size={40} className="mx-auto text-[#fd79a8] mb-4" />
        <h2 className="text-2xl text-[#f8f9fa] mb-2">Admin access only</h2>
        <p className="text-[#a0a0b0] mb-4">
          You need to be signed in with an admin account to view this page.
        </p>
        <Link to="/" className="text-[#6c5ce7] hover:text-[#a29bfe]">
          ← Back to home
        </Link>
      </div>
    );
  }

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (p: BackendProduct) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      brand: p.brand || 'Nexora',
      images: p.images,
      isActive: p.isActive,
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadAPI.uploadImage(file, form.name);
      setForm((f) => ({ ...f, images: [{ url: res.image.url, alt: res.image.alt || f.name }] }));
      toast.success('Image uploaded');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.images.length === 0) {
      toast.error('Please upload a product image first');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await productAPI.updateProduct(editingId, form);
        toast.success('Product updated');
      } else {
        await productAPI.createProduct(form);
        toast.success('Product created');
      }
      setShowForm(false);
      await loadProducts();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await productAPI.deleteProduct(id);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to delete product');
    }
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-normal text-[#f8f9fa] tracking-tight">Admin · Products</h1>
            <p className="text-sm text-[#6c6c7e] mt-1">{products.length} products in catalog</p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#6c5ce7] text-white rounded-xl text-sm font-medium hover:bg-[#a29bfe] transition-colors"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#a0a0b0]">
            <Loader2 className="animate-spin mx-auto mb-3" size={24} />
            Loading products…
          </div>
        ) : (
          <div className="bg-[#12121a] border border-[#2a2a3a] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a3a] text-left text-[#6c6c7e]">
                  <th className="p-4 font-medium">Image</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-[#2a2a3a] last:border-0">
                    <td className="p-4">
                      <img
                        src={p.images?.[0]?.url || '/images/placeholder.jpg'}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-4 text-[#f8f9fa]">{p.name}</td>
                    <td className="p-4 text-[#a0a0b0] capitalize">{p.category}</td>
                    <td className="p-4 text-[#a0a0b0]">₹{p.price.toLocaleString()}</td>
                    <td className="p-4 text-[#a0a0b0]">{p.stock}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(p)}
                          className="p-2 text-[#a0a0b0] hover:text-[#a29bfe] hover:bg-white/5 rounded-lg transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-2 text-[#a0a0b0] hover:text-[#fd79a8] hover:bg-white/5 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-[#6c6c7e]">
                      No products yet. Click "Add Product" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-[#f8f9fa]">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-[#a0a0b0] hover:text-[#f8f9fa]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image upload */}
              <div>
                <label className="text-sm text-[#a0a0b0] mb-2 block">Product Image</label>
                <div className="flex items-center gap-4">
                  {form.images[0]?.url && (
                    <img
                      src={form.images[0].url}
                      alt="preview"
                      className="w-16 h-16 rounded-lg object-cover border border-[#2a2a3a]"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-sm text-[#a0a0b0] cursor-pointer hover:border-[#6c5ce7] transition-colors">
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {uploading ? 'Uploading…' : form.images[0]?.url ? 'Replace image' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm text-[#a0a0b0] mb-1.5 block">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-11 px-4 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] focus:outline-none focus:border-[#6c5ce7]"
                />
              </div>

              <div>
                <label className="text-sm text-[#a0a0b0] mb-1.5 block">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] focus:outline-none focus:border-[#6c5ce7] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#a0a0b0] mb-1.5 block">Price (₹)</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full h-11 px-4 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] focus:outline-none focus:border-[#6c5ce7]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#a0a0b0] mb-1.5 block">Stock</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                    className="w-full h-11 px-4 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] focus:outline-none focus:border-[#6c5ce7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#a0a0b0] mb-1.5 block">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full h-11 px-4 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] focus:outline-none focus:border-[#6c5ce7]"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home">Home</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#a0a0b0] mb-1.5 block">Brand</label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full h-11 px-4 bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] focus:outline-none focus:border-[#6c5ce7]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full h-12 bg-[#6c5ce7] text-white rounded-xl font-medium hover:bg-[#a29bfe] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}