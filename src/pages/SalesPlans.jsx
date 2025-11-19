// src/pages/SalesMySalesPlans.jsx
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PageHeader from '@components/ui/PageHeader'
import Card from '@components/ui/Card'
import SearchInput from '@components/ui/SearchInput'
import Select from '@components/ui/Select'
import { FaFilter, FaListUl } from 'react-icons/fa'
import { FiPaperclip } from 'react-icons/fi'

// ---------- Dummy Data (hardcoded) ----------
const MOCK_SALES_PLANS = [
  {
    id: 'sp-001',
    title: 'SP-Q4 Retention Enterprise',
    customerId: 'c1',
    customerName: 'Samsung Electronics Indonesia',
    ownerName: 'Budi Santoso',
    status: 'Draft',
    approvalStatus: 'Pending',
    dateStart: '2025-10-01',
    dateEnd: '2025-12-31',
    description:
      'Fokus retaining top 10 key accounts dengan peningkatan cross-sell layanan managed service dan SD-WAN.',
    attachment: {
      fileName: 'SP-Q4-Retention-PT-Sinar-Jaya.pdf',
      url: '/dummy/sp-q4-sinarjaya.pdf',
      size: '1.2 MB',
    },
    managerComment: '',
    managerDecisionDate: null,
  },
  {
    id: 'sp-002',
    title: 'SP-Modernization DC & Cloud',
    customerId: 'c2',
    customerName: 'PT Andalan Telekom',
    ownerName: 'Budi Santoso',
    status: 'Active',
    approvalStatus: 'Approved',
    dateStart: '2025-07-01',
    dateEnd: '2025-12-31',
    description:
      'Modernisasi data center dan migrasi workload kritikal ke cloud untuk meningkatkan reliability dan agility.',
    attachment: {
      fileName: 'SP-Modernization-DC-Cloud-Andalan.pdf',
      url: '/dummy/sp-modernization-andalan.pdf',
      size: '900 KB',
    },
    managerComment:
      'Fokus dulu di 3 workload prioritas, pastikan ada quick win yang bisa di-showcase ke manajemen pelanggan.',
    managerDecisionDate: '2025-07-15T09:30:00.000Z',
  },
  {
    id: 'sp-003',
    title: 'SP-Upsell Collaboration Suite',
    customerId: 'c3',
    customerName: 'Tokopedia',
    ownerName: 'Budi Santoso',
    status: 'Closed',
    approvalStatus: 'Approved',
    dateStart: '2025-01-01',
    dateEnd: '2025-06-30',
    description:
      'Program upsell lisensi collaboration suite ke seluruh regional branch, termasuk enablement ke user champion.',
    attachment: {
      fileName: 'SP-Upsell-Collab-Nusantara.pdf',
      url: '/dummy/sp-upsell-collab-nusantara.pdf',
      size: '750 KB',
    },
    managerComment: 'Bagus, tolong dokumentasikan lesson learnt di akhir Q2.',
    managerDecisionDate: '2025-02-02T14:10:00.000Z',
  },
  {
    id: 'sp-004',
    title: 'SP-Pilot SD-WAN Multi-site',
    customerId: 'c4',
    customerName: 'PT Mandiri Tech',
    ownerName: 'Budi Santoso',
    status: 'Draft',
    approvalStatus: 'Rejected',
    dateStart: '2025-09-01',
    dateEnd: '2025-11-30',
    description:
      'Pilot SD-WAN untuk 5 site prioritas sebagai proof-of-value sebelum roll-out nasional.',
    attachment: {
      fileName: 'SP-Pilot-SDWAN-MandiriTech.pdf',
      url: '/dummy/sp-pilot-sdwan-mandiri.pdf',
      size: '640 KB',
    },
    managerComment:
      'Tolong revisi target revenue dan perjelas dependency dengan tim operasi sebelum diajukan ulang.',
    managerDecisionDate: '2025-09-10T11:20:00.000Z',
  },
]

// ---------- Helpers ----------
const statusBadge = (status) => {
  const s = status || 'Draft'
  if (s === 'Active') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (s === 'Closed') return 'bg-blue-50 text-blue-700 border border-blue-200'
  return 'bg-neutral-100 text-neutral-700 border border-neutral-200'
}

const approvalTone = (status) => {
  const s = status || 'Pending'
  if (s === 'Approved') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (s === 'Rejected') return 'bg-rose-50 text-rose-700 border border-rose-200'
  return 'bg-amber-50 text-amber-700 border border-amber-200'
}

export default function SalesMySalesPlans() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return MOCK_SALES_PLANS.filter((plan) => {
      const matchesSearch =
        !q ||
        plan.title?.toLowerCase().includes(q) ||
        plan.customerName?.toLowerCase().includes(q) ||
        plan.ownerName?.toLowerCase().includes(q)

      const s = plan.status || 'Draft'
      const matchesStatus = statusFilter === 'all' || s === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        variant="hero"
        title="Sales Plan Saya"
        subtitle="Lihat seluruh sales plan yang Anda miliki lintas pelanggan."
      />

      {/* Filter bar */}
      <Card className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-[#E0EDFF] text-[#1D4ED8]">
            <FaFilter className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800">
              Filter Sales Plan
            </p>
            <p className="text-xs text-neutral-500">
              Cari berdasarkan judul, pelanggan, atau nama Account Manager.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari plan / customer / AM"
            className="w-full md:w-64"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-52"
          >
            <option value="all">Semua Status Plan</option>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </Select>
        </div>
      </Card>

      {/* List content */}
      {filtered.length === 0 ? (
        <Card className="py-12 text-center text-sm text-neutral-500 border-dashed border-neutral-200">
          Tidak ada sales plan untuk filter ini.
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((plan) => {
            const statusLabel = plan.status || 'Draft'
            const approvalLabel = plan.approvalStatus || 'Pending'
            const decisionDateText = plan.managerDecisionDate
              ? `Diputuskan manager pada ${new Date(
                  plan.managerDecisionDate
                ).toLocaleString('id-ID')}`
              : 'Belum ada keputusan manager'

            return (
              <Card
                key={plan.id}
                className="p-4 space-y-3 border border-neutral-200/80 hover:border-[#1D4ED8]/30 hover:shadow-sm transition-all duration-150 cursor-pointer"
                onClick={() =>
                  navigate('/customers/4602776/sales-plan/sp_1763354286877')
                }
              >
                {/* Header: title + badges */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-base md:text-lg font-semibold text-neutral-900">
                      {plan.title || 'Untitled Sales Plan'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {plan.dateStart && plan.dateEnd
                        ? `${plan.dateStart} → ${plan.dateEnd}`
                        : 'Periode belum diisi'}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(
                        plan.status
                      )}`}
                    >
                      {statusLabel}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${approvalTone(
                        plan.approvalStatus
                      )}`}
                    >
                      Approval: {approvalLabel}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {plan.description && (
                  <p className="text-sm text-neutral-700 leading-relaxed line-clamp-2">
                    {plan.description}
                  </p>
                )}

                {/* Lampiran + Catatan Manager */}
                <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  {/* Lampiran */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Lampiran Sales Plan
                    </p>
                    {plan.attachment ? (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#D0D7F2] bg-[#F5F7FF] px-3 py-2 text-sm text-[#1D4ED8]">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/80">
                          <FiPaperclip className="w-4 h-4" />
                        </span>
                        <span className="truncate max-w-[220px]">
                          {plan.attachment.fileName}
                        </span>
                        {plan.attachment.size && (
                          <span className="text-xs text-neutral-400">
                            ({plan.attachment.size})
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 italic">
                        Belum ada lampiran.
                      </p>
                    )}
                  </div>

                  {/* Catatan Manager */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Catatan Manager
                    </p>
                    {plan.managerComment ? (
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                        {plan.managerComment}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 italic">
                        Belum ada catatan. Menunggu feedback dari Manager.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                  <span className="text-[11px] text-neutral-500">
                    {decisionDateText}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Klik card ini untuk melihat detail lengkap sales plan.
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
