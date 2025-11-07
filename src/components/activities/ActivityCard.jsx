import React from 'react'
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaBuilding,
  FaCheckCircle,
  FaHourglassHalf,
} from 'react-icons/fa'
import Card from '../ui/Card'
import { Badge } from '../ui/Badge'

export default function ActivityCard({ activity, onClick }) {
  const activityDateTime = new Date(`${activity.date}T${activity.time}`)
  const isPast = activityDateTime < new Date()
  const isCompleted = activity.status === 'completed'

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge variant="success" className="inline-flex items-center gap-1">
          <FaCheckCircle className="w-3 h-3" />
          Selesai
        </Badge>
      )
    }
    if (isPast) {
      return (
        <Badge variant="warning" className="inline-flex items-center gap-1">
          <FaHourglassHalf className="w-3 h-3" />
          Perlu Update
        </Badge>
      )
    }
    return (
      <Badge variant="info" className="inline-flex items-center gap-1">
        <FaCalendar className="w-3 h-3" />
        Akan Datang
      </Badge>
    )
  }

  return (
    <Card
      className="bg-white hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4"
      style={{
        borderLeftColor: isCompleted ? '#22c55e' : isPast ? '#f59e0b' : '#3b82f6',
      }}
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-800">{activity.title}</h3>
              <p className="text-sm text-neutral-600 mt-1">{activity.topic}</p>
            </div>
            {getStatusBadge()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <FaCalendar className="w-4 h-4 text-neutral-400" />
              <span>{new Date(activity.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaClock className="w-4 h-4 text-neutral-400" />
              <span>{activity.time}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="w-4 h-4 text-neutral-400" />
              <span>{activity.location}</span>
            </div>

            {activity.withCustomer && activity.customer && (
              <div className="flex items-center gap-2">
                <FaBuilding className="w-4 h-4 text-neutral-400" />
                <span className="font-medium text-[#E60012]">{activity.customer}</span>
              </div>
            )}
          </div>

          {activity.invitees && activity.invitees.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <FaUsers className="w-4 h-4 text-neutral-400" />
              <span>{activity.invitees.join(', ')}</span>
            </div>
          )}

          {activity.description && (
            <p className="text-sm text-neutral-600 line-clamp-2">{activity.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-center px-4 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="text-xs text-neutral-500 uppercase">Tipe</div>
            <div className="text-sm font-semibold text-neutral-800 mt-1">{activity.type}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
