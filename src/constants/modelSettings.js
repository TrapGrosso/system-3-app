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
    type: "text",
    helper: "Controls randomness: 0 = focused, 2 = creative"
  },
  {
    key: "top_p",
    label: "Top P",
    type: "text",
    helper: "Controls diversity via nucleus sampling"
  },
  {
    key: "max_tokens",
    label: "Max Tokens",
    type: "text",
    helper: "Maximum length of the response"
  },
  {
    key: "frequency_penalty",
    label: "Frequency Penalty",
    type: "text",
    helper: "Reduces repetition of tokens"
  },
  {
    key: "presence_penalty",
    label: "Presence Penalty",
    type: "text",
    helper: "Encourages talking about new topics"
  }
]
