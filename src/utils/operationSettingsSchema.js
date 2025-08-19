/**
 * Single source of truth for operation settings schema
 * Defines supported keys, types, defaults, and UI metadata.
 */

export const OPERATION_SCHEMAS = {
  create_variables_with_ai: {
    fields: {
      flags: {
        type: "flags",
        options: [
          { value: "send_notification", label: "Send Notification" },
          { value: "save_tokens", label: "Save Tokens" }
        ],
        default: []
      },
      agent_precision: {
        type: "enum",
        options: [
          { value: "low", label: "Low" },
          { value: "default", label: "Default" },
          { value: "high", label: "High" }
        ],
        default: "default"
      }
    }
  },
  add_leads: {
    fields: {
      flags: {
        type: "flags",
        options: [
          { value: "send_notification", label: "Send Notification" },
          { value: "find_emails", label: "Find Emails" },
          { value: "ignore_prospect_companies", label: "Ignore Prospect Companies" },
          { value: "ignore_all_companies", label: "Ignore All Companies" },
          { value: "add_to_ds_queue", label: "Add to DS Queue" },
          { value: "ignore_other_companies", label: "Ignore Other Companies" },
          { value: "output_prospect_with_companies", label: "Output Prospect with Companies" },
          { value: "search_companies_with_ai", label: "Search Companies with AI" }
        ],
        default: []
      },
      add_to_group: { type: "boolean", default: false },
      group: { type: "object", default: null }
    }
  },
  resolve_deep_search_queue: {
    fields: {
      flags: {
        type: "flags",
        options: [
          { value: "reduce_search_tokens", label: "Reduce Search Tokens" },
          { value: "cache_linkedin_scrape", label: "Cache LinkedIn Scrape" }
        ],
        default: []
      },
      agent_precision: {
        type: "enum",
        options: [
          { value: "low", label: "Low" },
          { value: "default", label: "Default" },
          { value: "high", label: "High" }
        ],
        default: "default"
      },
      max_searches: { type: "int", default: 3 },
      max_scrapes: { type: "int", default: 3 }
    }
  },
  search_company_with_ai: {
    fields: {
      flags: {
        type: "flags",
        options: [
          { value: "cache_linkedin_scrape", label: "Cache LinkedIn Scrape" }
        ],
        default: []
      },
      agent_precision: {
        type: "enum",
        options: [
          { value: "low", label: "Low" },
          { value: "default", label: "Default" },
          { value: "high", label: "High" }
        ],
        default: "default"
      }
    }
  },
  verify_emails_clearout: {
    fields: {
      include_valid: { type: "boolean", default: true },
      include_already_verified: { type: "boolean", default: false },
      verification_status: {
        type: "enum",
        options: [
          { value: "all", label: "All" },
          { value: "valid", label: "Valid Only" },
          { value: "catch_all", label: "Catch-all" },
          { value: "invalid", label: "Invalid" }
        ],
        default: "all"
      }
    }
  },
  find_emails_clearout: {
    fields: {
      retry_not_found: { type: "boolean", default: false },
      verify_emails: { type: "boolean", default: true },
      include_valid: { type: "boolean", default: true }
    }
  }
}

/**
 * Helper: get default values from schema
 */
export function getSchemaDefaults(operation) {
  const op = OPERATION_SCHEMAS[operation]
  if (!op) return {}
  const result = {}
  for (const [field, def] of Object.entries(op.fields)) {
    result[field] = def.default
  }
  return result
}