export const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'new':
      return 'secondary'
    case 'contacted':
      return 'default'
    case 'qualified':
      return 'default'
    default:
      return 'outline'
  }
}

export const getPageNumbers = (totalPages, currentPage, delta = 2) => {
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(0, currentPage - delta); 
       i <= Math.min(totalPages - 1, currentPage + delta); 
       i++) {
    range.push(i)
  }

  if (range[0] > 1) {
    rangeWithDots.push(0)
    if (range[0] > 2) {
      rangeWithDots.push('...')
    }
  }

  rangeWithDots.push(...range)

  if (range[range.length - 1] < totalPages - 2) {
    if (range[range.length - 1] < totalPages - 3) {
      rangeWithDots.push('...')
    }
    rangeWithDots.push(totalPages - 1)
  }

  return rangeWithDots
}
