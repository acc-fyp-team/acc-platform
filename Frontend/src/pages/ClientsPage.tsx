import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Modal from '../components/Modal'
import { api, errorMessage } from '../lib/api'

type Client = {
  clientID: number
  fullName: string
  email: string | null
  phone: string
  secondaryPhone: string | null
  cnic: string
  address: string | null
  city: string | null
  clientType: string
  status: string
}

// An empty form, also used to reset after saving.
const BLANK = {
  fullName: '',
  email: '',
  phone: '',
  secondaryPhone: '',
  cnic: '',
  address: '',
  city: '',
  clientType: 'External',
  status: 'Active',
}

const inputClass =
  'w-full rounded-[10px] border border-line-strong bg-card px-3 py-2 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand focus:ring-4 focus:ring-brand/10'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(BLANK)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Reload whenever the search box or the filter changes.
  // The small delay stops a request firing on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (status) params.set('status', status)

      api
        .get<Client[]>(`/api/clients?${params.toString()}`)
        .then((res) => {
          setClients(res.data)
          setListError(null)
        })
        .catch((err) => setListError(errorMessage(err, 'Could not load clients.')))
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(timer)
  }, [search, status])

  function reload() {
    // Nudging the search state re-runs the effect above.
    setSearch((s) => s)
    setLoading(true)
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (status) params.set('status', status)
    api
      .get<Client[]>(`/api/clients?${params.toString()}`)
      .then((res) => setClients(res.data))
      .catch((err) => setListError(errorMessage(err, 'Could not load clients.')))
      .finally(() => setLoading(false))
  }

  function openAdd() {
    setEditingId(null)
    setForm(BLANK)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(client: Client) {
    setEditingId(client.clientID)
    setForm({
      fullName: client.fullName,
      email: client.email ?? '',
      phone: client.phone,
      secondaryPhone: client.secondaryPhone ?? '',
      cnic: client.cnic,
      address: client.address ?? '',
      city: client.city ?? '',
      clientType: client.clientType,
      status: client.status,
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    setFormError(null)
    setSaving(true)

    // Empty optional fields go as null, not as empty strings.
    const payload = {
      ...form,
      email: form.email || null,
      secondaryPhone: form.secondaryPhone || null,
      address: form.address || null,
      city: form.city || null,
    }

    try {
      if (editingId === null) {
        await api.post('/api/clients', payload)
      } else {
        await api.put(`/api/clients/${editingId}`, payload)
      }
      setModalOpen(false)
      reload()
    } catch (err) {
      setFormError(errorMessage(err, 'Could not save the client.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(client: Client) {
    if (!window.confirm(`Delete ${client.fullName}? This cannot be undone.`)) return

    try {
      await api.delete(`/api/clients/${client.clientID}`)
      reload()
    } catch (err) {
      setListError(errorMessage(err, 'Could not delete the client.'))
    }
  }

  return (
    <AppLayout title="Clients">
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, CNIC or city"
            className={`${inputClass} pl-9`}
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${inputClass} w-auto`}
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          onClick={openAdd}
          className="ml-auto flex items-center gap-2 rounded-[10px] bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
        >
          <Plus size={16} />
          Add client
        </button>
      </div>

      {listError && (
        <div className="mb-4 rounded-[10px] border border-error/25 bg-error/8 px-4 py-3 text-sm text-error">
          {listError}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-card border border-line bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-raised text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">CNIC</th>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && clients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-subtle">
                    No clients found.
                  </td>
                </tr>
              )}

              {!loading &&
                clients.map((client) => (
                  <tr key={client.clientID} className="border-b border-line last:border-0">
                    <td className="px-5 py-3.5 font-medium text-ink">{client.fullName}</td>
                    <td className="px-5 py-3.5 text-muted">{client.phone}</td>
                    <td className="px-5 py-3.5 text-muted">{client.cnic}</td>
                    <td className="px-5 py-3.5 text-muted">{client.city ?? '-'}</td>
                    <td className="px-5 py-3.5 text-muted">{client.clientType}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={
                          client.status === 'Active'
                            ? 'rounded-full bg-success/12 px-2.5 py-1 text-xs font-medium text-success'
                            : 'rounded-full bg-raised px-2.5 py-1 text-xs font-medium text-muted'
                        }
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(client)}
                          className="rounded-lg p-2 text-muted transition hover:bg-hover hover:text-ink"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(client)}
                          className="rounded-lg p-2 text-muted transition hover:bg-error/10 hover:text-error"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && clients.length > 0 && (
        <p className="mt-3 text-sm text-subtle">{clients.length} client(s)</p>
      )}

      {/* Add / edit form */}
      <Modal
        open={modalOpen}
        title={editingId === null ? 'Add client' : 'Edit client'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave}>
          {formError && (
            <div className="mb-4 rounded-[10px] border border-error/25 bg-error/8 px-3.5 py-2.5 text-sm text-error">
              {formError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
                maxLength={50}
                className={inputClass}
              />
            </Field>

            <Field label="CNIC" required>
              <input
                value={form.cnic}
                onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                required
                maxLength={15}
                placeholder="3520212345671"
                className={inputClass}
              />
            </Field>

            <Field label="Phone" required>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                maxLength={15}
                placeholder="03001234567"
                className={inputClass}
              />
            </Field>

            <Field label="Secondary phone">
              <input
                value={form.secondaryPhone}
                onChange={(e) => setForm({ ...form, secondaryPhone: e.target.value })}
                maxLength={15}
                className={inputClass}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={100}
                className={inputClass}
              />
            </Field>

            <Field label="City">
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                maxLength={50}
                className={inputClass}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Address">
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  maxLength={255}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Client type" required>
              <select
                value={form.clientType}
                onChange={(e) => setForm({ ...form, clientType: e.target.value })}
                className={inputClass}
              >
                <option value="External">External</option>
                <option value="Internal">Internal</option>
              </select>
            </Field>

            <Field label="Status" required>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-[10px] border border-line px-4 py-2 text-sm text-muted transition hover:bg-hover hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-[10px] bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId === null ? 'Add client' : 'Save changes'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  )
}

// Small label + field wrapper so the form stays readable.
function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      {children}
    </label>
  )
}
