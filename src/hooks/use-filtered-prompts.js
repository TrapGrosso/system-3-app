import { useMemo } from 'react'

export const useFilteredPrompts = (prompts = [], searchTerm = '', selectedTags = [], selectedAgentType = '') => {
  return useMemo(() => {
    if (!prompts.length) return []

    return prompts.filter(prompt => {
      // Search term filter (name, description, prompt_text)
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchesName = prompt.name?.toLowerCase().includes(search)
        const matchesDescription = prompt.description?.toLowerCase().includes(search)
        const matchesPromptText = prompt.prompt_text?.toLowerCase().includes(search)
        const matchesTags = prompt.tags?.some(tag => tag.toLowerCase().includes(search))
        
        if (!matchesName && !matchesDescription && !matchesPromptText && !matchesTags) {
          return false
        }
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const promptTags = prompt.tags || []
        const hasMatchingTag = selectedTags.some(selectedTag => 
          promptTags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
        )
        if (!hasMatchingTag) {
          return false
        }
      }

      // Agent type filter
      if (selectedAgentType && prompt.agent_type !== selectedAgentType) {
        return false
      }

      return true
    })
  }, [prompts, searchTerm, selectedTags, selectedAgentType])
}

// Helper to extract all unique tags from prompts
export const useAllTags = (prompts = []) => {
  return useMemo(() => {
    const allTags = new Set()
    prompts.forEach(prompt => {
      if (prompt.tags && Array.isArray(prompt.tags)) {
        prompt.tags.forEach(tag => allTags.add(tag))
      }
    })
    return Array.from(allTags).sort()
  }, [prompts])
}
