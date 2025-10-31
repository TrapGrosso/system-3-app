/**
 * Generates high contrast hex color pairs for text and background
 * 
 * @param {Object} [options] - Optional input colors
 * @param {string} [options.text_color] - Existing text color in hex format
 * @param {string} [options.color] - Existing background color in hex format
 * @returns {Object} Object containing text_color and color hex strings
 */
export function generateRandomHex(options = {}) {
  const { text_color, color } = options
  
  // If both colors are provided, return them as-is
  if (text_color && color) {
    return { text_color, color }
  }
  
  // Helper function to generate a random hex color
  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  }
  
  // Helper function to calculate luminance of a hex color
  const getLuminance = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    
    const a = [r, g, b].map(v => {
      return (v <= 0.03928) ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }
  
  // Helper function to calculate contrast ratio between two colors
  const getContrastRatio = (color1, color2) => {
    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
  }
  
  // Helper function to generate a high contrast color pair
  const generateHighContrastPair = () => {
    let bgColor, textColor
    let contrastRatio
    
    do {
      bgColor = generateRandomColor()
      // For high contrast, use either black or white text
      const luminance = getLuminance(bgColor)
      textColor = luminance > 0.5 ? '#000000' : '#FFFFFF'
      contrastRatio = getContrastRatio(bgColor, textColor)
    } while (contrastRatio < 4.5) // WCAG AA standard minimum contrast ratio
    
    return { text_color: textColor, color: bgColor }
  }
  
  // If only text_color is provided, generate a high contrast background
  if (text_color && !color) {
    let bgColor
    let contrastRatio
    
    do {
      bgColor = generateRandomColor()
      contrastRatio = getContrastRatio(text_color, bgColor)
    } while (contrastRatio < 4.5)
    
    return { text_color, color: bgColor }
  }
  
  // If only color (background) is provided, generate a high contrast text color
  if (!text_color && color) {
    let textColor
    let contrastRatio
    
    do {
      // Use either black or white for maximum contrast
      const luminance = getLuminance(color)
      textColor = luminance > 0.5 ? '#000000' : '#FFFFFF'
      contrastRatio = getContrastRatio(color, textColor)
    } while (contrastRatio < 4.5)
    
    return { text_color: textColor, color }
  }
  
  // If neither is provided, generate a new high contrast pair
  return generateHighContrastPair()
}
