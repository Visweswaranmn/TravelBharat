import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getStates, createState, updateState, deleteState } from '../../services/stateService'
import { usePageTitle } from '../../hooks/usePageTitle'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import FormField from '../../components/admin/FormField'
import { inputClass, textareaClass } from '../../components/admin/formStyles'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const emptyForm = { name: '', code: '', capital: '', description: '', imageUrl: '', imageAlt: '' }

const toForm = (state) => ({
  name: state.name,
  code: state.code,
  capital: state.capital,
  description: state.description,
  imageUrl: state.image?.url || '',
  imageAlt: state.image?.alt || '',
})

const toPayload = (form) => ({
  name: form.name,
  code: form.code,
  capital: form.capital,
  description: form.description,
  image: { url: form.imageUrl, alt: form.imageAlt },
})

export default function ManageStates() {
  usePageTitle('Manage States')

  const [states, setStates] = useState([])
  const [status, setStatus] = useState('loading')

  const [editingState, setEditingState] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [deletingState, setDeletingState] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadStates = () => {
    setStatus('loading')
    getStates({ limit: 100 })
      .then((res) => {
        setStates(res.data.data.states)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(loadStates, [])

  const openCreate = () => {
    setForm(emptyForm)
    setErrors({})
    setEditingState({})
  }

  const openEdit = (state) => {
    setForm(toForm(state))
    setErrors({})
    setEditingState(state)
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.code.trim()) nextErrors.code = 'Code is required (e.g. TN)'
    if (!form.capital.trim()) nextErrors.capital = 'Capital is required'
    if (!form.description.trim()) nextErrors.description = 'Description is required'
    if (!form.imageUrl.trim()) nextErrors.imageUrl = 'Image URL is required'
    if (!form.imageAlt.trim()) nextErrors.imageAlt = 'Image alt text is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const payload = toPayload(form)
      if (editingState?._id) {
        await updateState(editingState._id, payload)
        toast.success('State updated')
      } else {
        await createState(payload)
        toast.success('State created')
      }
      setEditingState(null)
      loadStates()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteState(deletingState._id)
      toast.success('State deleted')
      setDeletingState(null)
      loadStates()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete state')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Manage States</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add State
        </button>
      </div>

      {status === 'loading' && <LoadingSpinner label="Loading states..." />}
      {status === 'error' && <ErrorMessage message="Couldn't load states." onRetry={loadStates} />}

      {status === 'success' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-medium">State</th>
                <th className="py-3 px-4 font-medium">Code</th>
                <th className="py-3 px-4 font-medium">Capital</th>
                <th className="py-3 px-4 font-medium">Cities</th>
                <th className="py-3 px-4 font-medium">Destinations</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state._id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-3">
                    <img src={state.image?.url} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-100" />
                    {state.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{state.code}</td>
                  <td className="py-3 px-4 text-slate-600">{state.capital}</td>
                  <td className="py-3 px-4 text-slate-600">{state.cityCount}</td>
                  <td className="py-3 px-4 text-slate-600">{state.destinationCount}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(state)}
                        aria-label={`Edit ${state.name}`}
                        className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingState(state)}
                        aria-label={`Delete ${state.name}`}
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

      {editingState && (
        <Modal title={editingState._id ? 'Edit State' : 'Add State'} onClose={() => setEditingState(null)}>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField label="Name" error={errors.name}>
              <input type="text" value={form.name} onChange={handleChange('name')} className={inputClass} />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Code" error={errors.code}>
                <input type="text" value={form.code} onChange={handleChange('code')} placeholder="TN" className={inputClass} />
              </FormField>
              <FormField label="Capital" error={errors.capital}>
                <input type="text" value={form.capital} onChange={handleChange('capital')} className={inputClass} />
              </FormField>
            </div>
            <FormField label="Description" error={errors.description}>
              <textarea rows={3} value={form.description} onChange={handleChange('description')} className={textareaClass} />
            </FormField>
            <FormField label="Image URL" error={errors.imageUrl}>
              <input type="text" value={form.imageUrl} onChange={handleChange('imageUrl')} className={inputClass} />
            </FormField>
            <FormField label="Image Alt Text" error={errors.imageAlt}>
              <input type="text" value={form.imageAlt} onChange={handleChange('imageAlt')} className={inputClass} />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingState(null)}
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

      {deletingState && (
        <ConfirmDialog
          title="Delete state?"
          message={`This will permanently delete "${deletingState.name}". States with existing cities can't be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingState(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
