import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import FormField from '../../components/admin/FormField'
import { inputClass, textareaClass } from '../../components/admin/formStyles'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const emptyForm = { name: '', description: '' }

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('loading')

  const [editingCategory, setEditingCategory] = useState(null) // null = closed, {} = new, {...} = editing
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [deletingCategory, setDeletingCategory] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadCategories = () => {
    setStatus('loading')
    getCategories()
      .then((res) => {
        setCategories(res.data.data.categories)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(loadCategories, [])

  const openCreate = () => {
    setForm(emptyForm)
    setErrors({})
    setEditingCategory({})
  }

  const openEdit = (category) => {
    setForm({ name: category.name, description: category.description || '' })
    setErrors({})
    setEditingCategory(category)
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      if (editingCategory?._id) {
        await updateCategory(editingCategory._id, form)
        toast.success('Category updated')
      } else {
        await createCategory(form)
        toast.success('Category created')
      }
      setEditingCategory(null)
      loadCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteCategory(deletingCategory._id)
      toast.success('Category deleted')
      setDeletingCategory(null)
      loadCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete category')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Manage Categories</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {status === 'loading' && <LoadingSpinner label="Loading categories..." />}
      {status === 'error' && <ErrorMessage message="Couldn't load categories." onRetry={loadCategories} />}

      {status === 'success' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Description</th>
                <th className="py-3 px-4 font-medium">Destinations</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 font-medium text-slate-900">{category.name}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-sm truncate">{category.description}</td>
                  <td className="py-3 px-4 text-slate-600">{category.destinationCount}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(category)}
                        aria-label={`Edit ${category.name}`}
                        className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(category)}
                        aria-label={`Delete ${category.name}`}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingCategory && (
        <Modal title={editingCategory._id ? 'Edit Category' : 'Add Category'} onClose={() => setEditingCategory(null)}>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField label="Name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="Description">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={textareaClass}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-60 rounded-lg transition-colors"
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deletingCategory && (
        <ConfirmDialog
          title="Delete category?"
          message={`This will permanently delete "${deletingCategory.name}". Categories with existing destinations can't be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingCategory(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
