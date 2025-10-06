import React from 'react'
import DOMPurify from 'dompurify'

/**
 * Determines if a string is likely HTML content
 * @param {string} content - The content to check
 * @returns {boolean} - True if content appears to be HTML
 */
export function isLikelyHtml(content) {
  if (typeof content !== 'string') return false
  // Enhanced regex to detect HTML tags more reliably
  return /<[a-z][\s\S]*>/i.test(content)
}

/**
 * Converts HTML to plain text
 * @param {string} html - HTML content to convert
 * @param {Object} options - Conversion options
 * @param {boolean} options.sanitize - Whether to sanitize HTML before conversion
 * @returns {string} - Plain text representation
 */
export function toPlainText(html, { sanitize = true } = {}) {
  if (typeof html !== 'string') return ''
  
  let cleanHtml = html
  if (sanitize && DOMPurify.isSupported) {
    // Strip all tags for plain text conversion
    cleanHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    })
  }
  
  // Create a temporary element to decode HTML entities
  const tempElement = document.createElement('div')
  tempElement.innerHTML = cleanHtml
  return (tempElement.textContent || tempElement.innerText || '').trim()
}

/**
 * Truncates text to a maximum number of characters
 * @param {string} text - Text to truncate
 * @param {Object} options - Truncation options
 * @param {number} options.maxChars - Maximum number of characters
 * @param {boolean} options.preserveWords - Whether to preserve whole words
 * @param {string} options.append - String to append when truncated
 * @returns {string} - Truncated text
 */
export function truncateText(text, { maxChars, preserveWords = true, append = '…' } = {}) {
  if (typeof text !== 'string' || maxChars === undefined || text.length <= maxChars) {
    return text
  }

  let truncated = text.slice(0, maxChars)
  
  if (preserveWords) {
    // Find the last space to preserve whole words
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    if (lastSpaceIndex > 0) {
      truncated = truncated.slice(0, lastSpaceIndex)
    }
  }
  
  return truncated + append
}

/**
 * ContentDisplay Component
 * A flexible component for displaying HTML or plain text content with various formatting options
 * 
 * @param {Object} props - Component props
 * @param {string} props.content - The content to display
 * @param {"auto"|"html"|"text"} props.mode - Display mode
 * @param {boolean} props.sanitize - Whether to sanitize HTML content
 * @param {number} props.maxChars - Maximum characters to display (truncates content)
 * @param {boolean} props.preserveWords - Preserve whole words when truncating
 * @param {string} props.append - String to append when content is truncated
 * @param {boolean} props.preWrap - Apply whitespace-pre-wrap for plain text
 * @param {number} props.lineClamp - Apply line clamping (e.g., 3 for line-clamp-3)
 * @param {boolean} props.prose - Apply Tailwind's prose classes for HTML content
 * @param {string} props.className - Additional classes for the content element
 * @param {string} props.containerClassName - Additional classes for the container
 * @param {"stripHtml"|"preserveTags"} props.truncateHtmlStrategy - How to handle HTML truncation
 * @returns {JSX.Element} - Rendered content
 */
export default function ContentDisplay({
  content = '',
  mode = 'auto',
  sanitize = true,
  maxChars,
  preserveWords = true,
  append = '…',
  preWrap = true,
  lineClamp,
  prose = false,
  className = '',
  containerClassName = '',
  truncateHtmlStrategy = 'stripHtml',
  ...props
}) {
  // Determine effective mode
  const effectiveMode = mode === 'auto' 
    ? (isLikelyHtml(content) ? 'html' : 'text') 
    : mode

  // Process content based on mode and options
  let displayContent = content || ''
  let isPlainText = false

  if (maxChars !== undefined) {
    if (effectiveMode === 'html' && truncateHtmlStrategy === 'stripHtml') {
      // Convert HTML to plain text for truncation
      displayContent = toPlainText(displayContent, { sanitize })
      displayContent = truncateText(displayContent, { maxChars, preserveWords, append })
      isPlainText = true
    } else {
      // Truncate plain text directly
      displayContent = truncateText(displayContent, { maxChars, preserveWords, append })
      isPlainText = (effectiveMode === 'text')
    }
  } else {
    isPlainText = (effectiveMode === 'text')
    
    // Sanitize HTML if requested
    if (effectiveMode === 'html' && sanitize && DOMPurify.isSupported) {
      displayContent = DOMPurify.sanitize(displayContent)
    }
  }

  // Determine classes
  const containerClasses = [
    containerClassName,
    lineClamp ? `line-clamp-${lineClamp}` : ''
  ].filter(Boolean).join(' ')

  const contentClasses = [
    className,
    isPlainText ? (preWrap ? 'whitespace-pre-wrap' : '') : '',
    effectiveMode === 'html' && prose ? 'prose prose-sm max-w-none dark:prose-invert' : '',
    lineClamp ? `line-clamp-${lineClamp}` : ''
  ].filter(Boolean).join(' ')

  // Render content
  if (isPlainText) {
    if (!displayContent) {
      return <div className={containerClasses} {...props}>No content available</div>
    }
    
    return (
      <div className={containerClasses} {...props}>
        <pre className={contentClasses}>{displayContent}</pre>
      </div>
    )
  }

  // Render HTML content
  if (!displayContent) {
    return <div className={containerClasses} {...props}>No content available</div>
  }

  return (
    <div className={containerClasses} {...props}>
      <div 
        className={contentClasses}
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />
    </div>
  )
}
