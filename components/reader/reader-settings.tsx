'use client'

import { X, Sun, Moon, Coffee, AlignJustify, Square } from 'lucide-react'
import { useReader, type ReaderTheme, type ReaderFitMode } from '@/lib/reader-store'

const panelBg: Record<string, string> = {
  light: 'bg-white border-gray-200 text-gray-800',
  dark: 'bg-gray-900 border-gray-700 text-gray-100',
  sepia: 'bg-amber-50 border-amber-200 text-amber-900',
}

const themes: { value: ReaderTheme; label: string; icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'sepia', label: 'Sepia', icon: Coffee },
]

const fitModes: { value: ReaderFitMode; label: string; icon: React.ElementType }[] = [
  { value: 'width', label: 'Fit Width', icon: AlignJustify },
  { value: 'page', label: 'Fit Page', icon: Square },
]

const zoomPresets = [50, 75, 100, 125, 150, 200]

export function ReaderSettings() {
  const { state, dispatch } = useReader()
  const bg = panelBg[state.theme] ?? panelBg.light

  if (!state.settingsOpen) return null

  return (
    <aside
      className={`absolute right-0 top-0 z-10 flex h-full w-72 flex-col border-l ${bg} shadow-xl`}
      aria-label="Reader settings"
    >
      {/* Header */}
      <div className={`flex h-12 items-center justify-between border-b px-4 ${bg}`}>
        <p className="text-sm font-semibold">Settings</p>
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
          aria-label="Close settings"
          className="rounded-md p-1 opacity-60 transition hover:opacity-100"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Theme */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-50">Theme</p>
          <div className="flex gap-2">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => dispatch({ type: 'SET_THEME', theme: value })}
                aria-label={`${label} theme`}
                aria-pressed={state.theme === value}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border py-3 text-xs transition ${
                  state.theme === value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-current/20 opacity-60 hover:opacity-100'
                }`}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Zoom */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-50">Zoom</p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={50}
              max={200}
              step={10}
              value={state.zoom}
              onChange={(e) => dispatch({ type: 'SET_ZOOM', zoom: parseInt(e.target.value, 10) })}
              aria-label="Zoom level"
              className="flex-1 accent-primary"
            />
            <span className="w-12 text-right text-sm font-medium">{state.zoom}%</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {zoomPresets.map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => dispatch({ type: 'SET_ZOOM', zoom: z })}
                aria-label={`Set zoom to ${z}%`}
                className={`rounded-md border px-2.5 py-1 text-xs transition ${
                  state.zoom === z
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-current/20 opacity-60 hover:opacity-100'
                }`}
              >
                {z}%
              </button>
            ))}
          </div>
        </section>

        {/* Fit mode */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-50">Page Fit</p>
          <div className="flex gap-2">
            {fitModes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => dispatch({ type: 'SET_FIT_MODE', mode: value })}
                aria-label={label}
                aria-pressed={state.fitMode === value}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm transition ${
                  state.fitMode === value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-current/20 opacity-60 hover:opacity-100'
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Keyboard shortcuts */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-50">
            Keyboard Shortcuts
          </p>
          <ul className="space-y-2 text-xs opacity-60">
            {[
              ['← / →', 'Previous / Next page'],
              ['Home / End', 'First / Last page'],
              ['+ / -', 'Zoom in / out'],
              ['B', 'Toggle bookmark'],
              ['S', 'Toggle settings'],
            ].map(([key, desc]) => (
              <li key={key} className="flex justify-between">
                <kbd className="rounded bg-current/10 px-1.5 py-0.5 font-mono">{key}</kbd>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  )
}
