export function buildStepVariantMetricStackData(steps = []) {
  // Group steps by step_number
  const stepGroups = new Map()
  
  steps.forEach(step => {
    const stepNumber = step.step || "0"
    if (!stepGroups.has(stepNumber)) {
      stepGroups.set(stepNumber, [])
    }
    stepGroups.get(stepNumber).push(step)
  })

  // Sort step numbers numerically (handle string numbers)
  const sortedStepNumbers = Array.from(stepGroups.keys()).sort((a, b) => {
    const numA = parseInt(a) || 0
    const numB = parseInt(b) || 0
    return numA - numB || a.localeCompare(b)
  })

  // Build chart data - one data point per Step×Variant
  const data = []
  
  sortedStepNumbers.forEach(stepNumber => {
    const stepVariants = stepGroups.get(stepNumber)
    
    // Sort variants within each step for consistent ordering
    const sortedVariants = stepVariants.sort((a, b) => {
      const variantA = a.variant || "0"
      const variantB = b.variant || "0"
      // Put "0" first, then alphabetically
      if (variantA === "0" && variantB !== "0") return -1
      if (variantA !== "0" && variantB === "0") return 1
      return variantA.localeCompare(variantB)
    })

    // Create one column per variant with ordinal labeling
    sortedVariants.forEach((step, variantIndex) => {
      const ordinalVariant = variantIndex + 1
      
      data.push({
        x: `Step ${stepNumber}, Variant ${ordinalVariant}`,
        opens: (step.open_rate || 0) * 100, // Convert to percentage
        clicks: (step.click_rate || 0) * 100,
        replies: (step.reply_rate || 0) * 100,
        // Include raw counts for enriched tooltips
        openedCount: step.opened || 0,
        clicksCount: step.clicks || 0,
        repliesCount: step.replies || 0,
        sentCount: step.sent || 0,
      })
    })
  })

  // Calculate the maximum stack height for dynamic Y-domain
  const maxStackHeight = data.length > 0 
    ? Math.max(...data.map(d => d.opens + d.clicks + d.replies), 0)
    : 0
  
  // Ensure minimum domain of 1 to avoid zero-domain issues
  const yMax = Math.max(1, maxStackHeight)
  const yDomain = [0, yMax]

  // Build series configuration for the three metrics
  const series = [
    {
      key: "opens",
      label: "Open Rate",
      color: "var(--color-chart-1)",
      stackId: "metrics",
    },
    {
      key: "clicks", 
      label: "Click Rate",
      color: "var(--color-chart-2)",
      stackId: "metrics",
    },
    {
      key: "replies",
      label: "Reply Rate", 
      color: "var(--color-chart-3)",
      stackId: "metrics",
    },
  ]

  return { data, series, yMax, yDomain }
}
