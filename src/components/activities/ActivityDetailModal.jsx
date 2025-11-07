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
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-800">{activity.title}</h2>
            <p className="text-neutral-600 mt-1">{activity.topic}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <FaCalendar className="w-5 h-5 text-neutral-400" />
            <div>
              <div className="text-xs text-neutral-500">Tanggal</div>
              <div className="font-medium text-neutral-800">
                {new Date(activity.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaClock className="w-5 h-5 text-neutral-400" />
            <div>
              <div className="text-xs text-neutral-500">Waktu</div>
              <div className="font-medium text-neutral-800">{activity.time}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="w-5 h-5 text-neutral-400" />
            <div>
              <div className="text-xs text-neutral-500">Lokasi</div>
              <div className="font-medium text-neutral-800">{activity.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaTag className="w-5 h-5 text-neutral-400" />
            <div>
              <div className="text-xs text-neutral-500">Tipe Aktivitas</div>
              <div className="font-medium text-neutral-800">{activity.type}</div>
            </div>
          </div>

          {activity.withCustomer && activity.customer && (
            <div className="flex items-center gap-3 col-span-2">
              <FaBuilding className="w-5 h-5 text-neutral-400" />
              <div>
                <div className="text-xs text-neutral-500">Customer</div>
                <div className="font-medium text-[#E60012]">{activity.customer}</div>
              </div>
            </div>
          )}

          {activity.invitees && activity.invitees.length > 0 && (
            <div className="flex items-start gap-3 col-span-2">
              <FaUsers className="w-5 h-5 text-neutral-400 mt-1" />
              <div>
                <div className="text-xs text-neutral-500">Peserta</div>
                <div className="font-medium text-neutral-800">{activity.invitees.join(', ')}</div>
              </div>
            </div>
          )}
        </div>

        {activity.description && (
          <div className="border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-semibold text-neutral-700 mb-2">Deskripsi</h4>
            <p className="text-sm text-neutral-600 whitespace-pre-wrap">{activity.description}</p>
          </div>
        )}

        {canAddProofAndMom && (
          <div className="border-t border-neutral-200 pt-4 space-y-4">
            <h4 className="text-sm font-semibold text-neutral-700">
              Upload Bukti & Minutes of Meeting
            </h4>
            <p className="text-xs text-neutral-500">
              Karena aktivitas ini sudah selesai dan melibatkan customer, silakan upload foto bukti dan file MoM
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <FaImage className="inline mr-2" />
                  Foto Bukti (JPG, PNG)
                </label>
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
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {proof.type?.startsWith('image/') && (
                      <img
                        src={proof.dataUrl}
                        alt="Proof"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-800">{proof.name}</p>
                      <p className="text-xs text-neutral-500">
                        {(proof.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => proofInputRef.current?.click()}
                      size="sm"
                    >
                      Ganti
                    </Button>
                    <Button variant="danger" onClick={() => setProof(null)} size="sm">
                      Hapus
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <FaFileAlt className="inline mr-2" />
                  Minutes of Meeting (PDF, DOC, DOCX)
                </label>
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
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <FaFileAlt className="w-10 h-10 text-neutral-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-800">{mom.name}</p>
                      <p className="text-xs text-neutral-500">
                        {(mom.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => momInputRef.current?.click()}
                      size="sm"
                    >
                      Ganti
                    </Button>
                    <Button variant="danger" onClick={() => setMom(null)} size="sm">
                      Hapus
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isCompleted && (activity.proof || activity.mom) && (
          <div className="border-t border-neutral-200 pt-4 space-y-4">
            <h4 className="text-sm font-semibold text-neutral-700">Dokumentasi</h4>

            {activity.proof && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Foto Bukti
                </label>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  {activity.proof.type?.startsWith('image/') && (
                    <img
                      src={activity.proof.dataUrl}
                      alt="Proof"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">{activity.proof.name}</p>
                  </div>
                </div>
              </div>
            )}

            {activity.mom && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Minutes of Meeting
                </label>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <FaFileAlt className="w-10 h-10 text-neutral-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">{activity.mom.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
