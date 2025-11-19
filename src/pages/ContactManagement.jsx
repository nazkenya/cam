import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SearchInput from '../components/ui/SearchInput'
import Tag from '../components/ui/Tag'
import Pagination from '../components/ui/Pagination'
import Table from '../components/ui/Table'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import StatsCard from '../components/ui/StatsCard'
import PageHeader from '../components/ui/PageHeader'

import {
  FaFilter,
  FaPlus,
  FaUsers,
  FaStar,
  FaBuilding,
  FaUserAlt,
} from 'react-icons/fa'

import rawContactsData from '../data/mockContacts'

/* -------------------------------------------------------
 * Helper Functions
 * ----------------------------------------------------- */

const getInitials = (name = '') => {
  const parts = name.split(' ')
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
  return `${first}${last}`.toUpperCase()
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-purple-100 text-purple-700',
  'bg-indigo-100 text-indigo-700',
]

const getAvatarColor = (name = '') => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

/* -------------------------------------------------------
 * Hardcoded enrichment (karena belum ada backend)
 * ----------------------------------------------------- */

// Di sini kita hardcode 3 kontak pertama sebagai "Penting".
// Kalau mau spesifik, kamu bisa ganti logika ini ke based on id.
const CONTACTS = rawContactsData.map((c, idx) => ({
  ...c,
  isPriority: idx < 3, // <— hardcode siapa yang penting
  tag: c.tag || (idx < 3
    ? { variant: 'warning', text: 'Penting' }
    : null),
}))

/* -------------------------------------------------------
 * Main Contact Management Page
 * ----------------------------------------------------- */

export default function ContactManagementPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  /* -------------------------------------------------------
   * Filtering
   * ----------------------------------------------------- */
  const filtered = useMemo(() => {
    if (!query) return CONTACTS
    const q = query.toLowerCase()
    return CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    )
  }, [query])

  /* -------------------------------------------------------
   * Pagination
   * ----------------------------------------------------- */
  const total = filtered.length
  const startIndex = (page - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, total)
  const pageRows = filtered.slice(startIndex, endIndex)

  const onPrev = () => setPage((p) => Math.max(1, p - 1))
  const onNext = () => setPage((p) => (endIndex < total ? p + 1 : p))

  /* -------------------------------------------------------
   * Table Columns + ⭐ PRIORITY BADGE
   * ----------------------------------------------------- */

  const columns = [
    {
      key: 'name',
      label: 'Kontak',
      render: (c) => {
        const initials = getInitials(c.name)
        const avatarColor = getAvatarColor(c.name)

        return (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${avatarColor}`}
            >
              {initials || <FaUserAlt />}
            </div>

            {/* Name + email + badge */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <strong className="font-semibold text-[#2E3048]">
                  {c.name}
                </strong>

                {/* ⭐ PRIORITAS (hardcode dari CONTACTS di atas) */}
                {c.isPriority && (
                  <FaStar
                    className="text-[#E60012] text-sm"
                    title="Kontak Penting"
                  />
                )}
              </div>

              <span className="text-neutral-500 text-[13px]">
                {c.email}
              </span>

              {/* Badge info tambahan */}
              {c.tag && (
                <Tag variant={c.tag.variant} className="ml-1">
                  {c.tag.text}
                </Tag>
              )}
            </div>
          </div>
        )
      },
    },
    { key: 'title', label: 'Jabatan' },
    { key: 'company', label: 'Perusahaan' },
    { key: 'phone', label: 'Telepon' },
  ]

  /* -------------------------------------------------------
   * Stats Cards (pakai data hardcoded CONTACTS)
   * ----------------------------------------------------- */

  const importantCount = CONTACTS.filter((c) => c.isPriority).length

  const stats = [
    { label: 'Total Kontak', value: CONTACTS.length, icon: FaUsers },
    { label: 'Kontak Penting', value: importantCount, icon: FaStar },
    { label: 'Perusahaan Terhubung', value: '32', icon: FaBuilding }, // ini juga boleh kamu hardcode / hitung unik company nanti
  ]

  /* -------------------------------------------------------
   * JSX
   * ----------------------------------------------------- */

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Manajemen Kontak"
        subtitle="Kelola dan pantau semua kontak pelanggan Anda"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <StatsCard
            key={idx}
            {...stat}
            className="animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          />
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Cari kontak, jabatan, perusahaan, atau email..."
            />

            <Button variant="secondary" className="inline-flex items-center gap-2">
              <FaFilter /> Filter
            </Button>
          </div>

          <Button variant="primary" className="inline-flex items-center gap-2">
            <FaPlus /> Tambah Kontak
          </Button>
        </div>
      </Card>

      {/* Table */}
      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <Table
          columns={columns}
          data={pageRows}
          rowKey="id"
          onRowClick={(c) => navigate(`/contacts/${c.id}`)}
        />
      </div>

      {/* Pagination */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm">
            <span className="text-neutral-800 font-semibold">
              {total === 0 ? 0 : startIndex + 1}-{endIndex}
            </span>
            <span className="text-neutral-500"> dari {total} Kontak</span>
          </div>

          <Pagination
            page={page}
            onPrev={onPrev}
            onNext={onNext}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(n) => {
              setRowsPerPage(n)
              setPage(1)
            }}
          />
        </div>
      </Card>
    </div>
  )
}
