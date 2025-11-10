import React, { useState, useRef } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Badge } from '../ui/Badge'
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaBuilding,
  FaTag,
  FaFileAlt,
  FaImage,
  FaCheckCircle,
  FaTrash,
} from 'react-icons/fa'

export default function ActivityDetailModal({ open, onClose, activity, onUpdate, onDelete }) {
  const [proof, setProof] = useState(activity.proof)
  const [mom, setMom] = useState(activity.mom)
  const proofInputRef = useRef(null)
  const momInputRef = useRef(null)

  const activityDateTime = new Date(`${activity.date}T${activity.time}`)
  const isPast = activityDateTime < new Date()
  const isCompleted = activity.status === 'completed'
  const canAddProofAndMom = isPast && activity.withCustomer

  const handleFileRead = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result,
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleProofChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileData = await handleFileRead(file)
      setProof(fileData)
    }
    e.target.value = ''
  }

  const handleMomChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileData = await handleFileRead(file)
      setMom(fileData)
    }
    e.target.value = ''
  }

  const handleSaveProofAndMom = () => {
    onUpdate({
      ...activity,
      proof,
      mom,
      status: 'completed',
    })
  }

  const handleMarkComplete = () => {
    onUpdate({
      ...activity,
      status: 'completed',
    })
  }

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) {
      onDelete(activity.id)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detail Aktivitas"
      panelClassName="max-w-3xl"
      footer={
        <div className="flex gap-3 justify-between">
          <Button variant="danger" onClick={handleDelete} className="inline-flex items-center gap-2">
            <FaTrash />
            Hapus
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Tutup
            </Button>
            {canAddProofAndMom && !isCompleted && (
              <Button
                variant="primary"
                onClick={handleSaveProofAndMom}
                disabled={!proof && !mom}
              >
                Simpan & Tandai Selesai
              </Button>
            )}
            {!isCompleted && !canAddProofAndMom && (
              <Button variant="primary" onClick={handleMarkComplete}>
                <FaCheckCircle className="inline mr-2" />
                Tandai Selesai
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-sm text-neutral-700">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{activity.title}</h2>
              <p className="text-neutral-500 mt-1">{activity.topic}</p>
            </div>
            {isCompleted ? (
              <Badge variant="success" className="inline-flex items-center gap-1">
                <FaCheckCircle className="w-3 h-3" />
                Selesai
              </Badge>
            ) : isPast ? (
              <Badge variant="warning">Perlu Update</Badge>
            ) : (
              <Badge variant="info">Akan Datang</Badge>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-5 shadow-inner space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Rangkuman Jadwal</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/60 bg-white p-4 flex gap-3">
              <FaCalendar className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-xs uppercase text-neutral-500">Tanggal</p>
                <p className="font-medium text-neutral-900">
                  {new Date(activity.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-white/60 bg-white p-4 flex gap-3">
              <FaClock className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-xs uppercase text-neutral-500">Waktu</p>
                <p className="font-medium text-neutral-900">{activity.time}</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/60 bg-white p-4 flex gap-3 sm:col-span-2">
              <FaMapMarkerAlt className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-xs uppercase text-neutral-500">Lokasi</p>
                <p className="font-medium text-neutral-900">{activity.location}</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/60 bg-white p-4 flex gap-3">
              <FaTag className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="text-xs uppercase text-neutral-500">Tipe Aktivitas</p>
                <p className="font-medium text-neutral-900">{activity.type}</p>
              </div>
            </div>
            {activity.withCustomer && activity.customer && (
              <div className="rounded-xl border border-white/60 bg-white p-4 flex gap-3 sm:col-span-2">
                <FaBuilding className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-xs uppercase text-neutral-500">Customer</p>
                  <p className="font-medium text-[#E60012]">{activity.customer}</p>
                </div>
              </div>
            )}
            {activity.invitees && activity.invitees.length > 0 && (
              <div className="rounded-xl border border-white/60 bg-white p-4 flex gap-3 sm:col-span-2">
                <FaUsers className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-xs uppercase text-neutral-500">Peserta</p>
                  <p className="font-medium text-neutral-900">{activity.invitees.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {activity.description && (
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Deskripsi</p>
            <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">{activity.description}</p>
          </section>
        )}

        {canAddProofAndMom && (
          <section className="rounded-2xl border border-dashed border-neutral-300 bg-white p-5 shadow-sm space-y-4">
            <div>
              <p className="text-sm font-semibold text-neutral-800">Lengkapi Dokumentasi</p>
              <p className="text-xs text-neutral-500 mt-1">
                Aktivitas ini membutuhkan bukti dan MoM untuk menandai status selesai.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                  <FaImage className="text-neutral-400" />
                  Foto Bukti (JPG, PNG)
                </div>
                <input
                  ref={proofInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProofChange}
                />
                {!proof ? (
                  <Button
                    variant="secondary"
                    onClick={() => proofInputRef.current?.click()}
                    className="inline-flex items-center gap-2"
                  >
                    <FaImage />
                    Pilih Foto
                  </Button>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
                    {proof.type?.startsWith('image/') && (
                      <img src={proof.dataUrl} alt="Proof" className="h-20 w-20 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-800">{proof.name}</p>
                      <p className="text-xs text-neutral-500">{(proof.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="secondary" size="sm" onClick={() => proofInputRef.current?.click()}>
                        Ganti
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setProof(null)}>
                        Hapus
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                  <FaFileAlt className="text-neutral-400" />
                  Minutes of Meeting (PDF, DOC, DOCX)
                </div>
                <input
                  ref={momInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleMomChange}
                />
                {!mom ? (
                  <Button
                    variant="secondary"
                    onClick={() => momInputRef.current?.click()}
                    className="inline-flex items-center gap-2"
                  >
                    <FaFileAlt />
                    Pilih File MoM
                  </Button>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
                    <FaFileAlt className="h-10 w-10 text-neutral-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-800">{mom.name}</p>
                      <p className="text-xs text-neutral-500">{(mom.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="secondary" size="sm" onClick={() => momInputRef.current?.click()}>
                        Ganti
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setMom(null)}>
                        Hapus
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {isCompleted && (activity.proof || activity.mom) && (
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
            <div>
              <p className="text-sm font-semibold text-neutral-800">Dokumentasi</p>
              <p className="text-xs text-neutral-500 mt-1">File yang telah disimpan untuk aktivitas ini.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {activity.proof && (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                  <p className="text-xs uppercase text-neutral-500">Foto Bukti</p>
                  <div className="flex items-center gap-3">
                    {activity.proof.type?.startsWith('image/') && (
                      <img
                        src={activity.proof.dataUrl}
                        alt="Proof"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{activity.proof.name}</p>
                    </div>
                  </div>
                </div>
              )}
              {activity.mom && (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                  <p className="text-xs uppercase text-neutral-500">Minutes of Meeting</p>
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="h-10 w-10 text-neutral-400" />
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{activity.mom.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </Modal>
  )
}
