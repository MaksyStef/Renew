import type { ReactElement } from 'react'


type PageItem = number | '…'

export function getPageItems (
  current: number,
  total: number,
  edge = 2,
  behind = 2,
  ahead = 3
): PageItem[] {
  const pages = new Set<number>()

  for (let i = 1; i <= Math.min(edge, total); i++) pages.add(i)
  for (let i = Math.max(total - edge + 1, 1); i <= total; i++) pages.add(i)
  for (let i = current - behind; i <= current + ahead; i++) {
    if (i >= 1 && i <= total) pages.add(i)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const items: PageItem[] = []

  sorted.forEach((page, idx) => {
    if (idx > 0) {
      const gap = page - sorted[idx - 1]
      if (gap === 2) items.push(page - 1) // a single hidden page is shown instead of "…"
      else if (gap > 2) items.push('…')
    }
    items.push(page)
  })

  return items
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination ({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps): ReactElement | null {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Project pages" className={`pagination-nav ${className}`}>
      <ul className="pagination justify-content-center flex-wrap mb-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
        </li>

        {getPageItems(currentPage, totalPages).map((item, idx) =>
          item === '…' ? (
            <li key={`ellipsis-${idx}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={item} className={`page-item ${item === currentPage ? 'active' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(item)}
                aria-current={item === currentPage ? 'page' : undefined}
              >
                {item}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}