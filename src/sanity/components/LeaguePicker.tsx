'use client'

import { useEffect, useState, useCallback } from 'react'
import { set, unset } from 'sanity'
import type { NumberInputProps } from 'sanity'

interface League {
  id: number
  name: string
}

export function LeaguePicker(props: NumberInputProps) {
  const { value, onChange } = props
  const [leagues, setLeagues] = useState<League[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/sportsmonks/leagues')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLeagues(data)
        } else {
          setError(data.error || 'Kunne ikke hente ligaer')
        }
      })
      .catch(() => setError('Kunne ikke hente ligaer'))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value
      onChange(val ? set(Number(val)) : unset())
    },
    [onChange]
  )

  const filtered = search.trim()
    ? leagues.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
    : leagues

  const selectedLeague = leagues.find((l) => l.id === value)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Search filter */}
      <input
        type="text"
        placeholder="Søg efter liga..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          background: '#fff',
          color: '#111',
        }}
      />

      {/* Dropdown */}
      {loading ? (
        <div style={{ fontSize: '13px', color: '#888', padding: '8px' }}>Henter ligaer…</div>
      ) : error ? (
        <div style={{ fontSize: '13px', color: '#c00', padding: '8px' }}>{error}</div>
      ) : (
        <select
          value={value ?? ''}
          onChange={handleSelect}
          size={8}
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            background: '#fff',
            color: '#111',
            minHeight: '180px',
          }}
        >
          <option value="">— Vælg liga —</option>
          {filtered.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} (ID: {l.id})
            </option>
          ))}
        </select>
      )}

      {selectedLeague && (
        <div style={{ fontSize: '13px', color: '#555' }}>
          Valgt: <strong>{selectedLeague.name}</strong> (ID: {selectedLeague.id})
        </div>
      )}
    </div>
  )
}
