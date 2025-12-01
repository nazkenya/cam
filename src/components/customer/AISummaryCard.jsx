import React from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { FaRobot, FaLightbulb, FaSync } from 'react-icons/fa'
import { RadialProgress } from '../../pages/accountProfile/components/RadialProgress'

export default function AISummaryCard({
  customerName,
  profileCurrent = 9,
  profileTotal = 12,
  summaryText,
  recommendationText,
  lastUpdated = '28 Nov 2025, 14:30 WIB',
  onRefresh,
  isLoading = false
}) {
  const navigate = useNavigate()
  const { id } = useParams()

  const handleRefresh = () => {
    if (onRefresh && !isLoading) onRefresh()
  }

  return (
    <Card>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        {/* KIRI: Insight AI */}
        <div className="min-w-0 flex-1 flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <FaRobot className="w-3.5 h-3.5" />
              <span>Ringkasan Profil AI</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="font-medium">Diperbarui: {lastUpdated}</span>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`p-1.5 rounded-full transition-all ${
                  isLoading
                    ? 'cursor-not-allowed opacity-60 text-neutral-300'
                    : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50'
                }`}
                title="Refresh Analisis AI"
              >
                <FaSync className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Ringkasan */}
          <div
            className={`rounded-xl border border-neutral-100 bg-white px-4 py-3.5 text-sm text-neutral-700 leading-relaxed transition-opacity duration-200 ${
              isLoading ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {summaryText ? (
              summaryText
            ) : customerName ? (
              <>
                <span className="font-semibold text-neutral-900">
                  Berdasarkan profil akun {customerName},
                </span>{' '}
                data menunjukkan tingkat interaksi yang stabil. Profil perusahaan mengindikasikan
                fase ekspansi dengan kebutuhan infrastruktur yang meningkat. Kelengkapan data saat
                ini cukup untuk memetakan kebutuhan dasar, namun pengayaan data tambahan akan
                meningkatkan akurasi analisis.
              </>
            ) : (
              'Ringkasan AI dihasilkan dari data Profil Akun yang tersedia. Lengkapi profil untuk meningkatkan akurasi analisis dan rekomendasi.'
            )}
          </div>

          {/* Rekomendasi */}
          <div
            className={`rounded-xl border border-amber-100 bg-white px-4 py-3.5 transition-opacity duration-200 ${
              isLoading ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-amber-800">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 border border-amber-100">
                <FaLightbulb className="w-3.5 h-3.5" />
              </div>
              <span>Rekomendasi & Tindakan Selanjutnya</span>
            </div>
            <div className="text-sm text-neutral-800 leading-relaxed">
              {recommendationText ? (
                recommendationText
              ) : (
                <>
                  Mengingat profil teknologi saat ini, peluang utama adalah menawarkan
                  <span className="font-semibold text-neutral-900">
                    {' '}
                    Layanan Keamanan Terkelola (Managed Security)
                  </span>
                  .
                  <span className="block text-xs text-neutral-500 italic mt-1.5">
                    Alasan: Tech stack mereka belum memiliki lapisan keamanan siber khusus, sehingga
                    risiko operasional dan kepatuhan masih relatif tinggi.
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* KANAN */}
        <div className="shrink-0 w-full sm:w-56 lg:w-64">
          <div className="h-full rounded-2xl border border-neutral-100 bg-white px-4 py-4 flex flex-col items-center gap-4">
            <div className="text-xs font-semibold text-neutral-700 tracking-wide uppercase">
              Kelengkapan Profil
            </div>

            <div className="py-1">
              <RadialProgress current={profileCurrent} total={profileTotal} />
            </div>

            <div className="w-full text-center">
              <p className="mb-3 text-xs text-neutral-500">
                Profil yang lengkap membantu AI memberikan analisis yang lebih relevan.
              </p>

              {/* tombol minimalis seperti contoh */}
              <Button
                onClick={() => navigate(`/customers/${id}/account-profile`)}
                size="sm"
                className="inline-flex w-full items-center justify-center gap-2 text-sm font-medium"
              >
                Update Account Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
