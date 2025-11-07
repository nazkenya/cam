import React, { useState } from 'react'
import Modal from '../ui/Modal'
import FormInput from '../ui/FormInput'
import Button from '../ui/Button'
import Select from '../ui/Select'
import YesNoToggle from '../ui/YesNoToggle'

const ACTIVITY_TYPES = [
  'Meeting',
  'Call',
  'Email',
  'Visit',
  'Presentation',
  'Workshop',
  'Internal Meeting',
  'Training',
  'Other',
]

export default function ActivityFormModal({ open, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      type: '',
      date: '',
      time: '',
      location: '',
      topic: '',
      description: '',
      withCustomer: false,
      customer: '',
      invitees: '',
    }
  )

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const activityData = {
      ...formData,
      invitees: formData.invitees
        ? formData.invitees.split(',').map((i) => i.trim())
        : [],
    }
    onSubmit(activityData)
    handleReset()
  }

  const handleReset = () => {
    setFormData({
      title: '',
      type: '',
      date: '',
      time: '',
      location: '',
      topic: '',
      description: '',
      withCustomer: false,
      customer: '',
      invitees: '',
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit Aktivitas' : 'Tambah Aktivitas Baru'}
      panelClassName="max-w-2xl"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Simpan' : 'Tambah Aktivitas'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Judul Aktivitas <span className="text-red-500">*</span>
          </label>
          <FormInput
            type="text"
            value={formData.title}
            onChange={(val) => handleChange('title', val)}
            placeholder="Contoh: Meeting dengan PT Telkom Regional"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tipe Aktivitas <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              required
            >
              <option value="">Pilih tipe...</option>
              {ACTIVITY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Topik <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="text"
              value={formData.topic}
              onChange={(val) => handleChange('topic', val)}
              placeholder="Contoh: Q4 Business Review"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="date"
              value={formData.date}
              onChange={(val) => handleChange('date', val)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Waktu <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="text"
              value={formData.time}
              onChange={(val) => handleChange('time', val)}
              placeholder="Contoh: 10:00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Lokasi <span className="text-red-500">*</span>
          </label>
          <FormInput
            type="text"
            value={formData.location}
            onChange={(val) => handleChange('location', val)}
            placeholder="Contoh: Telkom Office Jakarta"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Melibatkan Customer?
          </label>
          <YesNoToggle
            value={formData.withCustomer}
            onChange={(val) => handleChange('withCustomer', val)}
          />
        </div>

        {formData.withCustomer && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Nama Customer <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="text"
              value={formData.customer}
              onChange={(val) => handleChange('customer', val)}
              placeholder="Contoh: PT Telkom Regional"
              required={formData.withCustomer}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Undang Peserta
          </label>
          <FormInput
            type="text"
            value={formData.invitees}
            onChange={(val) => handleChange('invitees', val)}
            placeholder="Pisahkan dengan koma: John Doe, Jane Smith"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Masukkan nama Account Manager atau peserta lain, pisahkan dengan koma
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Deskripsi
          </label>
          <FormInput
            type="textarea"
            value={formData.description}
            onChange={(val) => handleChange('description', val)}
            placeholder="Deskripsi detail tentang aktivitas ini..."
            rows={4}
          />
        </div>
      </form>
    </Modal>
  )
}
