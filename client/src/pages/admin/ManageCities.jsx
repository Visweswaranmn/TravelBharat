import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getCities, createCity, updateCity, deleteCity } from '../../services/cityService'
import { getStates } from '../../services/stateService'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import FormField from '../../components/admin/FormField'
import { inputClass, textareaClass } from '../../components/admin/formStyles'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const emptyForm = { name: '', state: '', description: '', imageUrl: '', imageAlt: '' }

const toForm = (city) => ({
  name: city.name,
  state: city.state?._id || city.state,
  description: city.description,
  imageUrl: city.image?.url || '',
  imageAlt: city.image?.alt || '',
})

const toPayload = (form) => ({
  name: form.name,
  state: form.state,
  description: form.description,
  image: { url: form.imageUrl, alt: form.imageAlt },
})

export default function ManageCities() {
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])
  const [status, setStatus] = useState('loading')

  const [editingCity, setEditingCity] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [deletingCity, setDeletingCity] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = () => {
    setStatus('loading')
    Promise.all([getCities({}), getStates({ limit: 100 })])
      .then(([citiesRes, statesRes]) => {
        setCities(citiesRes.data.data.cities)
        setStates(statesRes.data.data.states)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(loadData, [])

  const openCreate = () => {
    setForm({ ...emptyForm, state: states[0]?._id || '' })
    setErrors({})
    setEditingCity({})
  }

  const openEdit = (city) => {
    setForm(toForm(city))
    setErrors({})
    setEditingCity(city)
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.state) nextErrors.state = 'State is required'
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
      if (editingCity?._id) {
        await updateCity(editingCity._id, payload)
        toast.success('City updated')
      } else {
        await createCity(payload)
        toast.success('City created')
      }
      setEditingCity(null)
      loadData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteCity(deletingCity._id)
      toast.success('City deleted')
      setDeletingCity(null)
      loadData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete city')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Manage Cities</h1>
        <button
          type="button"
          onClick={openCreate}
          disabled={states.length === 0}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add City
        </button>
      </div>

      {status === 'loading' && <LoadingSpinner label="Loading cities..." />}
      {status === 'error' && <ErrorMessage message="Couldn't load cities." onRetry={loadData} />}

      {status === 'success' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-medium">City</th>
                <th className="py-3 px-4 font-medium">State</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city._id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-3">
                    <img src={city.image?.url} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-100" />
                    {city.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{city.state?.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(city)}
                        aria-label={`Edit ${city.name}`}
                        className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCity(city)}
                        aria-label={`Delete ${city.name}`}
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

      {editingCity && (
        <Modal title={editingCity._id ? 'Edit City' : 'Add City'} onClose={() => setEditingCity(null)}>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField label="Name" error={errors.name}>
              <input type="text" value={form.name} onChange={handleChange('name')} className={inputClass} />
            </FormField>
            <FormField label="State" error={errors.state}>
              <select value={form.state} onChange={handleChange('state')} className={inputClass}>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </FormField>
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
                onClick={() => setEditingCity(null)}
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

      {deletingCity && (
        <ConfirmDialog
          title="Delete city?"
          message={`This will permanently delete "${deletingCity.name}". Cities with existing destinations can't be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingCity(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
