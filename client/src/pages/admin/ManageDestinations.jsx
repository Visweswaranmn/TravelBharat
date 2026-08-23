import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { getDestinations, createDestination, updateDestination, deleteDestination } from '../../services/destinationService'
import { getStates } from '../../services/stateService'
import { getCities } from '../../services/cityService'
import { getCategories } from '../../services/categoryService'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import FormField from '../../components/admin/FormField'
import { inputClass, textareaClass } from '../../components/admin/formStyles'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const emptyForm = {
  name: '',
  state: '',
  city: '',
  category: '',
  shortDescription: '',
  description: '',
  historicalSignificance: '',
  bestTimeToVisit: '',
  entryFee: '',
  openingTime: '',
  closingTime: '',
  lat: '',
  lng: '',
  mapUrl: '',
  images: [{ url: '', alt: '' }],
  travelTips: [''],
  featured: false,
}

const toForm = (destination) => ({
  name: destination.name,
  state: destination.state?._id || destination.state,
  city: destination.city?._id || destination.city,
  category: destination.category?._id || destination.category,
  shortDescription: destination.shortDescription,
  description: destination.description,
  historicalSignificance: destination.historicalSignificance || '',
  bestTimeToVisit: destination.bestTimeToVisit || '',
  entryFee: destination.entryFee || '',
  openingTime: destination.openingTime || '',
  closingTime: destination.closingTime || '',
  lat: destination.location?.lat ?? '',
  lng: destination.location?.lng ?? '',
  mapUrl: destination.mapUrl || '',
  images: destination.images?.length ? destination.images.map((img) => ({ url: img.url, alt: img.alt })) : [{ url: '', alt: '' }],
  travelTips: destination.travelTips?.length ? destination.travelTips : [''],
  featured: destination.featured || false,
})

const toPayload = (form) => {
  const hasCoords = form.lat !== '' && form.lng !== ''
  return {
    name: form.name,
    state: form.state,
    city: form.city,
    category: form.category,
    shortDescription: form.shortDescription,
    description: form.description,
    historicalSignificance: form.historicalSignificance || undefined,
    bestTimeToVisit: form.bestTimeToVisit || undefined,
    entryFee: form.entryFee || undefined,
    openingTime: form.openingTime || undefined,
    closingTime: form.closingTime || undefined,
    location: hasCoords ? { lat: Number(form.lat), lng: Number(form.lng) } : undefined,
    mapUrl: form.mapUrl || (hasCoords ? `https://www.google.com/maps?q=${form.lat},${form.lng}` : undefined),
    images: form.images.filter((img) => img.url.trim() && img.alt.trim()),
    travelTips: form.travelTips.map((tip) => tip.trim()).filter(Boolean),
    featured: form.featured,
  }
}

export default function ManageDestinations() {
  const [destinations, setDestinations] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('loading')

  const [editingDestination, setEditingDestination] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [deletingDestination, setDeletingDestination] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = () => {
    setStatus('loading')
    Promise.all([getDestinations({ limit: 100 }), getStates({ limit: 100 }), getCities({}), getCategories()])
      .then(([destinationsRes, statesRes, citiesRes, categoriesRes]) => {
        setDestinations(destinationsRes.data.data.destinations)
        setStates(statesRes.data.data.states)
        setCities(citiesRes.data.data.cities)
        setCategories(categoriesRes.data.data.categories)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(loadData, [])

  // Cities available for whichever state is currently selected in the form.
  const citiesForSelectedState = useMemo(
    () => cities.filter((city) => (city.state?._id || city.state) === form.state),
    [cities, form.state]
  )

  const openCreate = () => {
    const firstState = states[0]?._id || ''
    const firstCity = cities.find((c) => (c.state?._id || c.state) === firstState)?._id || ''
    setForm({ ...emptyForm, state: firstState, city: firstCity, category: categories[0]?._id || '' })
    setErrors({})
    setEditingDestination({})
  }

  const openEdit = (destination) => {
    setForm(toForm(destination))
    setErrors({})
    setEditingDestination(destination)
  }

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // Changing state invalidates the previously selected city.
      if (field === 'state') {
        const stillValid = cities.some((c) => c._id === prev.city && (c.state?._id || c.state) === value)
        if (!stillValid) next.city = cities.find((c) => (c.state?._id || c.state) === value)?._id || ''
      }
      return next
    })
  }

  const updateImageRow = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? { ...img, [field]: value } : img)),
    }))
  }
  const addImageRow = () => setForm((prev) => ({ ...prev, images: [...prev.images, { url: '', alt: '' }] }))
  const removeImageRow = (index) => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))

  const updateTipRow = (index, value) => {
    setForm((prev) => ({ ...prev, travelTips: prev.travelTips.map((tip, i) => (i === index ? value : tip)) }))
  }
  const addTipRow = () => setForm((prev) => ({ ...prev, travelTips: [...prev.travelTips, ''] }))
  const removeTipRow = (index) => setForm((prev) => ({ ...prev, travelTips: prev.travelTips.filter((_, i) => i !== index) }))

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.state) nextErrors.state = 'State is required'
    if (!form.city) nextErrors.city = 'City is required'
    if (!form.category) nextErrors.category = 'Category is required'
    if (!form.shortDescription.trim()) nextErrors.shortDescription = 'Short description is required'
    else if (form.shortDescription.length > 220) nextErrors.shortDescription = 'Must be under 220 characters'
    if (!form.description.trim()) nextErrors.description = 'Description is required'
    if (!form.images.some((img) => img.url.trim() && img.alt.trim())) {
      nextErrors.images = 'At least one image with a URL and alt text is required'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const payload = toPayload(form)
      if (editingDestination?._id) {
        await updateDestination(editingDestination._id, payload)
        toast.success('Destination updated')
      } else {
        await createDestination(payload)
        toast.success('Destination created')
      }
      setEditingDestination(null)
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
      await deleteDestination(deletingDestination._id)
      toast.success('Destination deleted')
      setDeletingDestination(null)
      loadData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete destination')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Manage Destinations</h1>
        <button
          type="button"
          onClick={openCreate}
          disabled={states.length === 0 || categories.length === 0}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {status === 'loading' && <LoadingSpinner label="Loading destinations..." />}
      {status === 'error' && <ErrorMessage message="Couldn't load destinations." onRetry={loadData} />}

      {status === 'success' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-medium">Destination</th>
                <th className="py-3 px-4 font-medium">State</th>
                <th className="py-3 px-4 font-medium">City</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Featured</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((destination) => (
                <tr key={destination._id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-3">
                    <img
                      src={destination.images?.[0]?.url}
                      alt=""
                      className="w-9 h-9 rounded-lg object-cover bg-slate-100"
                    />
                    {destination.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{destination.state?.name}</td>
                  <td className="py-3 px-4 text-slate-600">{destination.city?.name}</td>
                  <td className="py-3 px-4 text-slate-600">{destination.category?.name}</td>
                  <td className="py-3 px-4">
                    {destination.featured && (
                      <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(destination)}
                        aria-label={`Edit ${destination.name}`}
                        className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingDestination(destination)}
                        aria-label={`Delete ${destination.name}`}
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

      {editingDestination && (
        <Modal
          title={editingDestination._id ? 'Edit Destination' : 'Add Destination'}
          onClose={() => setEditingDestination(null)}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-4">
              <FormField label="Name" error={errors.name}>
                <input type="text" value={form.name} onChange={handleChange('name')} className={inputClass} />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="State" error={errors.state}>
                  <select value={form.state} onChange={handleChange('state')} className={inputClass}>
                    {states.map((state) => (
                      <option key={state._id} value={state._id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="City" error={errors.city}>
                  <select value={form.city} onChange={handleChange('city')} className={inputClass}>
                    {citiesForSelectedState.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Category" error={errors.category}>
                  <select value={form.category} onChange={handleChange('category')} className={inputClass}>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Short Description (max 220 characters)" error={errors.shortDescription}>
                <textarea rows={2} value={form.shortDescription} onChange={handleChange('shortDescription')} className={textareaClass} />
              </FormField>
              <FormField label="Description" error={errors.description}>
                <textarea rows={4} value={form.description} onChange={handleChange('description')} className={textareaClass} />
              </FormField>
              <FormField label="Historical Significance (optional)">
                <textarea rows={2} value={form.historicalSignificance} onChange={handleChange('historicalSignificance')} className={textareaClass} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Best Time to Visit">
                <input type="text" value={form.bestTimeToVisit} onChange={handleChange('bestTimeToVisit')} placeholder="October to March" className={inputClass} />
              </FormField>
              <FormField label="Entry Fee">
                <input type="text" value={form.entryFee} onChange={handleChange('entryFee')} placeholder="Free" className={inputClass} />
              </FormField>
              <FormField label="Opening Time">
                <input type="text" value={form.openingTime} onChange={handleChange('openingTime')} placeholder="9:00 AM" className={inputClass} />
              </FormField>
              <FormField label="Closing Time">
                <input type="text" value={form.closingTime} onChange={handleChange('closingTime')} placeholder="6:00 PM" className={inputClass} />
              </FormField>
              <FormField label="Latitude">
                <input type="number" step="any" value={form.lat} onChange={handleChange('lat')} className={inputClass} />
              </FormField>
              <FormField label="Longitude">
                <input type="number" step="any" value={form.lng} onChange={handleChange('lng')} className={inputClass} />
              </FormField>
            </div>
            <FormField label="Map URL (optional — auto-generated if left blank and lat/lng are set)">
              <input type="text" value={form.mapUrl} onChange={handleChange('mapUrl')} className={inputClass} />
            </FormField>

            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">Images</p>
              {errors.images && <p className="text-sm text-red-600 mb-2">{errors.images}</p>}
              <div className="space-y-2">
                {form.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={image.url}
                      onChange={(e) => updateImageRow(index, 'url', e.target.value)}
                      placeholder="Image URL"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => updateImageRow(index, 'alt', e.target.value)}
                      placeholder="Alt text"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageRow(index)}
                      disabled={form.images.length === 1}
                      aria-label="Remove image"
                      className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addImageRow} className="text-sm font-medium text-orange-600 hover:underline mt-2">
                + Add another image
              </button>
            </div>

            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">Travel Tips</p>
              <div className="space-y-2">
                {form.travelTips.map((tip, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => updateTipRow(index, e.target.value)}
                      placeholder="A helpful tip for visitors"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeTipRow(index)}
                      disabled={form.travelTips.length === 1}
                      aria-label="Remove tip"
                      className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addTipRow} className="text-sm font-medium text-orange-600 hover:underline mt-2">
                + Add another tip
              </button>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={form.featured} onChange={handleChange('featured')} className="rounded" />
              Feature this destination on the homepage
            </label>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => setEditingDestination(null)}
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

      {deletingDestination && (
        <ConfirmDialog
          title="Delete destination?"
          message={`This will permanently delete "${deletingDestination.name}".`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingDestination(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
