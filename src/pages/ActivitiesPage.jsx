import React, { useState, useMemo } from 'react'
import { FaPlus, FaCalendar, FaList, FaFilter } from 'react-icons/fa'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import SearchInput from '../components/ui/SearchInput'
import ActivityFormModal from '../components/activities/ActivityFormModal'
import ActivityCard from '../components/activities/ActivityCard'
import ActivityDetailModal from '../components/activities/ActivityDetailModal'
import ActivityCalendar from '../components/activities/ActivityCalendar'

export default function ActivitiesPage() {
  const [view, setView] = useState('calendar')
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: 'Meeting with PT Telkom Regional',
      type: 'Meeting',
      date: '2025-11-10',
      time: '10:00',
      location: 'Telkom Office Jakarta',
      topic: 'Q4 Business Review',
      description: 'Quarterly business review meeting to discuss performance and future plans.',
      withCustomer: true,
      customer: 'PT Telkom Regional',
      invitees: ['John Doe', 'Jane Smith'],
      status: 'upcoming',
      createdBy: 'Current User',
      proof: null,
      mom: null,
    },
    {
      id: 2,
      title: 'Sales Planning Session',
      type: 'Internal Meeting',
      date: '2025-11-08',
      time: '14:00',
      location: 'Conference Room A',
      topic: 'Monthly Sales Target Review',
      description: 'Monthly internal meeting to review sales targets and strategies.',
      withCustomer: false,
      customer: null,
      invitees: ['Alice Johnson', 'Bob Williams'],
      status: 'completed',
      createdBy: 'Current User',
      proof: null,
      mom: null,
    },
  ])

  const filteredActivities = useMemo(() => {
    if (!searchQuery) return activities
    const q = searchQuery.toLowerCase()
    return activities.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.topic.toLowerCase().includes(q) ||
        (a.customer && a.customer.toLowerCase().includes(q))
    )
  }, [activities, searchQuery])

  const handleCreateActivity = (newActivity) => {
    const activity = {
      ...newActivity,
      id: Date.now(),
      status: 'upcoming',
      createdBy: 'Current User',
      proof: null,
      mom: null,
    }
    setActivities([...activities, activity])
    setShowFormModal(false)
  }

  const handleUpdateActivity = (updatedActivity) => {
    setActivities(activities.map((a) => (a.id === updatedActivity.id ? updatedActivity : a)))
    setSelectedActivity(null)
    setShowDetailModal(false)
  }

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter((a) => a.id !== id))
    setSelectedActivity(null)
    setShowDetailModal(false)
  }

  const handleViewActivity = (activity) => {
    setSelectedActivity(activity)
    setShowDetailModal(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        variant="hero"
        title="Aktivitas"
        subtitle="Kelola dan pantau semua aktivitas sales dan customer engagement"
      />

      <Card className="bg-white">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari aktivitas, topik, atau customer..."
            />
            <Button variant="secondary" className="w-fit inline-flex items-center gap-2">
              <FaFilter />
              Filter
            </Button>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex gap-2 border border-neutral-200 rounded-lg p-1">
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'calendar'
                    ? 'bg-[#E60012] text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <FaCalendar className="inline mr-2" />
                Kalender
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-[#E60012] text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <FaList className="inline mr-2" />
                List
              </button>
            </div>

            <Button
              variant="primary"
              onClick={() => setShowFormModal(true)}
              className="inline-flex items-center gap-2"
            >
              <FaPlus />
              Tambah Aktivitas
            </Button>
          </div>
        </div>
      </Card>

      {view === 'calendar' ? (
        <ActivityCalendar activities={filteredActivities} onActivityClick={handleViewActivity} />
      ) : (
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <Card className="bg-white text-center py-12">
              <p className="text-neutral-500">Tidak ada aktivitas ditemukan</p>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => handleViewActivity(activity)}
              />
            ))
          )}
        </div>
      )}

      <ActivityFormModal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleCreateActivity}
      />

      {selectedActivity && (
        <ActivityDetailModal
          open={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedActivity(null)
          }}
          activity={selectedActivity}
          onUpdate={handleUpdateActivity}
          onDelete={handleDeleteActivity}
        />
      )}
    </div>
  )
}
