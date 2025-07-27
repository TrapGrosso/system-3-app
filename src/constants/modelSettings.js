// Default model settings for advanced options
export const DEFAULT_MODEL_SETTINGS = {
  temperature: 0.7,
  top_p: 1,
  max_tokens: 1024,
  frequency_penalty: 0,
  presence_penalty: 0,
}

// Field configuration for model settings
export const MODEL_SETTINGS_FIELDS = [
  {
    key: "temperature",
    label: "Temperature",
    type: "number",
    min: 0,
    max: 2,
    step: 0.1,
    parser: (v) => parseFloat(v) || 0.7,
    helper: "Controls randomness: 0 = focused, 2 = creative"
  },
  {
    key: "top_p",
    label: "Top P",
    type: "number",
    min: 0,
    max: 1,
    step: 0.1,
    parser: (v) => parseFloat(v) || 1,
    helper: "Controls diversity via nucleus sampling"
  },
  {
    key: "max_tokens",
    label: "Max Tokens",
    type: "number",
    min: 1,
    max: 4000,
    step: 1,
    parser: (v) => parseInt(v) || 1024,
    helper: "Maximum length of the response"
  },
  {
    key: "frequency_penalty",
    label: "Frequency Penalty",
    type: "number",
    min: -2,
    max: 2,
    step: 0.1,
    parser: (v) => parseFloat(v) || 0,
    helper: "Reduces repetition of tokens"
  },
  {
    key: "presence_penalty",
    label: "Presence Penalty",
    type: "number",
    min: -2,
    max: 2,
    step: 0.1,
    parser: (v) => parseFloat(v) || 0,
    helper: "Encourages talking about new topics"
  }
]
