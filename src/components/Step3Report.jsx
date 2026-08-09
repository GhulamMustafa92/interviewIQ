import React from 'react'
import { buildReportData } from '../utils/reportUtils'

export default function Step3Report({ report }) {
  const data = buildReportData(report || {})
  const scorePoints = (data.questionwiseScore.length ? data.questionwiseScore : [{ score: data.overallScore, feedback: 'No feedback yet.' }]).map((item, index) => ({
    label: `Q${index + 1}`,
    value: Number(item.score || 0),
    feedback: item.feedback || 'No feedback available.'
  }))

  const maxValue = 10
  const width = 720
  const height = 320
  const padding = 40
  const stepX = scorePoints.length > 1 ? (width - padding * 2) / (scorePoints.length - 1) : width / 2

  const points = scorePoints.map((point, index) => {
    const x = padding + index * stepX
    const y = height - padding - (point.value / maxValue) * (height - padding * 2)
    return { ...point, x, y }
  })

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
          <p className="text-sm uppercase tracking-[0.3em] opacity-80">Interview Summary</p>
          <h1 className="text-3xl font-bold mt-2">Mountain View Performance Graph</h1>
          <p className="mt-3 text-emerald-50 max-w-2xl">{data.summary}</p>
        </div>

        <div className="p-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-500">Overall Score</p>
                  <h2 className="text-5xl font-bold text-slate-900">{data.overallScore}/10</h2>
                </div>
                <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  {data.overallScore >= 8 ? 'Excellent' : data.overallScore >= 6 ? 'Good' : 'Needs Practice'}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">Mountain Graph</h3>
                <span className="text-sm text-slate-500">Question by question</span>
              </div>
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72 rounded-2xl bg-white p-2">
                <path d="M 40 280 L 40 40 L 680 40" fill="none" stroke="#d1fae5" strokeWidth="2" strokeDasharray="4 4" />
                <path d={areaPath} fill="url(#mountainGradient)" opacity="0.7" />
                <path d={linePath} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {points.map((point, index) => (
                  <g key={`${point.label}-${index}`}>
                    <circle cx={point.x} cy={point.y} r="7" fill="#0f766e" stroke="#ffffff" strokeWidth="3" />
                    <text x={point.x} y={height - 12} textAnchor="middle" fontSize="12" fill="#64748b">{point.label}</text>
                  </g>
                ))}
                <defs>
                  <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#ecfdf5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
            <h3 className="text-xl font-semibold text-slate-900">Question Review</h3>
            <div className="mt-5 space-y-4">
              {data.questionwiseScore.length ? data.questionwiseScore.map((item, index) => (
                <div key={`${item.question}-${index}`} className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-800">{item.question}</p>
                    <span className="text-sm font-bold text-emerald-600">{item.score || 0}/10</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.feedback || 'No feedback available.'}</p>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No question review data is available yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
