'use client'

import { useState } from 'react'
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Link as LinkIcon, Undo, Redo } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const ToolbarButton = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    className={cn(
      'inline-flex size-8 items-center justify-center rounded-md transition-colors',
      active
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    )}
  >
    <Icon className="size-4" />
  </button>
)

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  // Simple contenteditable-based editor
  // In production, this would use a library like TipTap or Slate
  const [html, setHtml] = useState(value)

  function execCommand(command: string, arg?: string) {
    document.execCommand(command, false, arg)
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
        <ToolbarButton icon={Bold} label="Bold" onClick={() => execCommand('bold')} />
        <ToolbarButton icon={Italic} label="Italic" onClick={() => execCommand('italic')} />
        <div className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton icon={Heading1} label="Heading 1" onClick={() => execCommand('formatBlock', 'H2')} />
        <ToolbarButton icon={Heading2} label="Heading 2" onClick={() => execCommand('formatBlock', 'H3')} />
        <div className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton icon={List} label="Bullet list" onClick={() => execCommand('insertUnorderedList')} />
        <ToolbarButton icon={ListOrdered} label="Numbered list" onClick={() => execCommand('insertOrderedList')} />
        <div className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton
          icon={LinkIcon}
          label="Insert link"
          onClick={() => {
            const url = prompt('Enter URL:')
            if (url) execCommand('createLink', url)
          }}
        />
        <div className="ml-auto flex items-center gap-0.5">
          <ToolbarButton icon={Undo} label="Undo" onClick={() => execCommand('undo')} />
          <ToolbarButton icon={Redo} label="Redo" onClick={() => execCommand('redo')} />
        </div>
      </div>

      {/* Editor area */}
      <div
        contentEditable
        suppressContentEditableWarning
        className="prose min-h-[200px] max-w-none px-4 py-3 text-sm outline-none [&:empty]:before:pointer-events-none [&:empty]:before:text-muted-foreground [&:empty]:before:content-[attr(data-placeholder)]"
        data-placeholder={placeholder || 'Start writing...'}
        dangerouslySetInnerHTML={{ __html: html }}
        onInput={(e) => {
          const content = (e.target as HTMLDivElement).innerHTML
          setHtml(content)
          onChange(content)
        }}
      />
    </div>
  )
}
