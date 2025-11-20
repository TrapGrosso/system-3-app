# DynamicSettingsForm - Documentation

## Overview

`DynamicSettingsForm` is a pure schema-driven, reusable settings form component. It renders UI controls entirely from a schema definition and emits changes via callbacks without managing internal state for values.

**Key features:**
- Schema-driven: UI structure and behavior defined entirely by the schema prop
- Flexible output: Emit either full schema updates or flat values via callbacks
- Cross-dependencies: Fields can conditionally show/hide based on other field values
- Primitive types only: Supports boolean, integer, string, enum strings, and string arrays
- Special UI controls: Groups, prompts, and status selection
- Optional dirty tracking: Compare current values to defaults

---

## Component API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `schema` | Object | Yes | - | The schema definition (see Schema Structure below) |
| `onSchemaChange` | Function | No | - | Called with updated schema when any field changes |
| `onValuesChange` | Function | No | - | Called with flat `{ [key]: value }` object when fields change |
| `onSubmit` | Function | No | - | Called when Save button is clicked, receives flat values object |
| `title` | String | No | `"Settings"` | Card title |
| `description` | String | No | - | Card description text |
| `updatedAt` | String | No | - | Display string for "Last updated" |
| `isLoading` | Boolean | No | `false` | Show skeleton loaders for all fields |
| `isSaving` | Boolean | No | `false` | Disable controls and show saving state |
| `showSubmit` | Boolean | No | `true` | Whether to render the Save button |
| `trackDirty` | Boolean | No | `true` | Enable dirty tracking (compare values vs defaults) |
| `submitLabel` | String | No | `"Save"` | Label for the submit button |

---

## Schema Structure

### Top-Level Schema

```typescript
{
  sections: [
    {
      id: string,              // Optional unique identifier
      title: string,           // Optional section title
      description: string,     // Optional section description
      fields: [ /* array of field definitions */ ]
    }
  ]
}
```

### Field Definition

Each field in a `fields` array has the following structure:

```typescript
{
  key: string,                 // Required: property name in values object
  label: string,               // Optional: UI label (auto-generated from key if omitted)
  description: string,         // Optional: helper text displayed below label
  
  // Value type (what gets stored)
  type: "boolean" | "int" | "string" | "string_enum" | "string_multi",
  
  // UI control type (how it's rendered)
  ui: "checkbox" | "text" | "number" | "select" | "group_single" | "prompts_multi" | "status_single",
  
  default: any,                // Optional: default value (must match type)
  value: any,                  // Optional: current value (must match type)
  
  required: boolean,           // Optional: validation flag (not yet enforced)
  placeholder: string,         // Optional: placeholder text for inputs
  
  // For select-type fields only
  options: [                   // Array of {value, label} objects
    { value: string, label: string }
  ],
  
  // Cross-dependency / conditional visibility
  visibleWhen: {               // Optional: show field only when condition is met
    field: string,             // Key of the controlling field
    equals: any                // Value to match for visibility
  },
  
  // Special UI metadata
  promptType: string           // For prompts_multi: filter prompt type (e.g., "deep_research")
}
```

---

## Value Types vs UI Types

The component supports **primitive value types** exclusively, but uses specialized UI controls for domain-specific selections.

| Value Type | UI Type | Stored As | Example Use Case |
|------------|---------|-----------|------------------|
| `boolean` | `checkbox` | `true` / `false` | Enable/disable features |
| `int` | `number` | `number` | Max searches, limits |
| `string` | `text` | `string` | Text input, notes |
| `string_enum` | `select` | `string` | Agent precision (low/default/high) |
| `string` | `group_single` | `string` (group ID) | Select a single group |
| `string_multi` | `prompts_multi` | `string[]` (prompt IDs) | Select multiple prompts |
| `string` | `status_single` | `string` (status ID) | Select a status |

### Value Resolution Order

For each field, the current value is resolved as:
1. `field.value` (if present)
2. `field.default` (if present)
3. Type-based empty:
   - `boolean` → `false`
   - `int` → `0`
   - `string` / `string_enum` → `""`
   - `string_multi` → `[]`

---

## Cross-Dependencies (Conditional Visibility)

Fields can be conditionally shown based on other field values using the `visibleWhen` property.

### Simple Example: Group Selection

```javascript
{
  sections: [
    {
      title: "Lead Settings",
      fields: [
        {
          key: "add_to_group",
          label: "Add to Group",
          type: "boolean",
          ui: "checkbox",
          default: false
        },
        {
          key: "group_id",
          label: "Select Group",
          type: "string",
          ui: "group_single",
          default: "",
          visibleWhen: {
            field: "add_to_group",
            equals: true
          }
        }
      ]
    }
  ]
}
```

In this example, the "Select Group" field only appears when the "Add to Group" checkbox is checked.

### How It Works

- The component builds a values map on each render
- For each field with `visibleWhen`, it checks: `values[visibleWhen.field] === visibleWhen.equals`
- If false, the field is not rendered
- The hidden field's value is preserved in the schema (not reset)

---

## Event Callbacks

### onSchemaChange(nextSchema)

Called whenever a field value changes. Receives the **full updated schema** with the new `value` property set on the changed field.

**Use this when:**
- You want to persist the entire schema (including defaults and metadata)
- You're building a schema editor or settings manager
- You need to track both values and defaults

```javascript
<DynamicSettingsForm
  schema={schema}
  onSchemaChange={(updatedSchema) => {
    setSchema(updatedSchema)
    // Or save to database
    saveSchemaToAPI(updatedSchema)
  }}
/>
```

### onValuesChange(nextValues)

Called whenever a field value changes. Receives a **flat object** of `{ [fieldKey]: currentValue }` for all fields.

**Use this when:**
- You only care about the current values, not the schema structure
- You're integrating with existing state management
- You want a simple key-value representation

```javascript
<DynamicSettingsForm
  schema={schema}
  onValuesChange={(values) => {
    setFormValues(values)
  }}
/>
```

### onSubmit(values)

Called when the Save button is clicked. Receives a **flat values object** (same as `onValuesChange`).

```javascript
<DynamicSettingsForm
  schema={schema}
  onSubmit={async (values) => {
    await saveSettings(values)
  }}
/>
```

---

## Usage Examples

### Example 1: Basic Settings Form

```javascript
import { DynamicSettingsForm } from "@/components/ui/dynamic-settings-form"

const schema = {
  sections: [
    {
      title: "General",
      fields: [
        {
          key: "send_notification",
          label: "Send Notification",
          type: "boolean",
          ui: "checkbox",
          default: false
        },
        {
          key: "max_retries",
          label: "Max Retries",
          type: "int",
          ui: "number",
          default: 3
        }
      ]
    }
  ]
}

function MySettings() {
  const [currentSchema, setCurrentSchema] = useState(schema)

  return (
    <DynamicSettingsForm
      title="My Settings"
      schema={currentSchema}
      onSchemaChange={setCurrentSchema}
      onSubmit={(values) => {
        console.log("Saving:", values)
      }}
    />
  )
}
```

### Example 2: With Cross-Dependencies

```javascript
const leadSchema = {
  sections: [
    {
      id: "lead_processing",
      title: "Lead Processing",
      description: "Configure how leads are processed",
      fields: [
        {
          key: "find_emails",
          label: "Find Emails",
          type: "boolean",
          ui: "checkbox",
          default: false
        },
        {
          key: "verify_emails",
          label: "Verify Emails",
          type: "boolean",
          ui: "checkbox",
          default: true,
          visibleWhen: {
            field: "find_emails",
            equals: true
          }
        },
        {
          key: "add_to_group",
          label: "Add to Group",
          type: "boolean",
          ui: "checkbox",
          default: false
        },
        {
          key: "group_id",
          label: "Target Group",
          type: "string",
          ui: "group_single",
          default: "",
          visibleWhen: {
            field: "add_to_group",
            equals: true
          }
        }
      ]
    }
  ]
}

function LeadSettings() {
  const [schema, setSchema] = useState(leadSchema)

  return (
    <DynamicSettingsForm
      title="Lead Settings"
      description="Configure default behavior for lead processing"
      schema={schema}
      onSchemaChange={setSchema}
      onSubmit={async (values) => {
        await saveLeadSettings(values)
      }}
    />
  )
}
```

### Example 3: Advanced with All Field Types

```javascript
const advancedSchema = {
  sections: [
    {
      title: "AI Configuration",
      fields: [
        {
          key: "agent_precision",
          label: "Agent Precision",
          type: "string_enum",
          ui: "select",
          default: "default",
          options: [
            { value: "low", label: "Low" },
            { value: "default", label: "Default" },
            { value: "high", label: "High" }
          ]
        },
        {
          key: "max_searches",
          label: "Max Searches",
          type: "int",
          ui: "number",
          default: 3,
          description: "Maximum number of searches per operation"
        }
      ]
    },
    {
      title: "Prompts & Status",
      fields: [
        {
          key: "prompt_ids",
          label: "Deep Research Prompts",
          type: "string_multi",
          ui: "prompts_multi",
          default: [],
          promptType: "deep_research"
        },
        {
          key: "status_id",
          label: "Default Status",
          type: "string",
          ui: "status_single",
          default: ""
        }
      ]
    }
  ]
}
```

### Example 4: Values-Only Pattern

If you only care about values (not the full schema), you can use only `onValuesChange`:

```javascript
function SimpleForm() {
  const [values, setValues] = useState({})
  
  // Static schema definition
  const schema = { /* ... */ }

  return (
    <DynamicSettingsForm
      schema={schema}
      onValuesChange={setValues}
      showSubmit={false}  // Hide save button, use values directly
    />
  )
}
```

---

## Dirty Tracking

When `trackDirty` is `true` (default), the component compares each field's current `value` against its `default` to determine if the form is dirty. The Save button only appears when changes are detected.

To disable dirty tracking:

```javascript
<DynamicSettingsForm
  schema={schema}
  trackDirty={false}  // Save button always visible
  onSubmit={handleSubmit}
/>
```

---

## Migration from operationSettingsSchema

If you have existing operation schemas from `operationSettingsSchema.js`, here's how to convert them:

**Old format:**
```javascript
{
  fields: {
    flags: {
      type: "flags",
      options: [/* ... */],
      default: []
    },
    add_to_group: {
      type: "boolean",
      default: false
    }
  }
}
```

**New format:**
```javascript
{
  sections: [
    {
      title: "Settings",
      fields: [
        // flags → multiple boolean checkboxes
        {
          key: "send_notification",
          type: "boolean",
          ui: "checkbox",
          default: false
        },
        {
          key: "add_to_group",
          type: "boolean",
          ui: "checkbox",
          default: false
        }
      ]
    }
  ]
}
```

Note: The old `flags` type (array of selected options) is not supported. Convert to individual boolean fields.

---

## Best Practices

1. **Define defaults** for all fields to ensure predictable behavior
2. **Use descriptive keys** that are meaningful when humanized (e.g., `max_retries` becomes "Max Retries")
3. **Group related fields** into logical sections
4. **Use `visibleWhen`** sparingly - complex dependencies can confuse users
5. **Provide `description`** for fields that need clarification
6. **Choose the right value type**: Use `string_enum` with `select` UI for limited choices
7. **Track changes** with `onValuesChange` for real-time updates, `onSubmit` for batch saves

---

## Limitations & Future Enhancements

### Current Limitations

- No built-in validation (though `required` flag is supported for future use)
- Single-condition `visibleWhen` only (no AND/OR logic)
- No support for the old `flags` array type
- No nested objects or complex data structures

### Potential Enhancements

- Multi-condition visibility rules (`visibleWhen: [{ field, equals }, { field, equals }]`)
- Field validation with error messages
- Custom field renderers via a plugin system
- Field-level `disabled` rules similar to `visibleWhen`
- Support for field groups/subsections within a section
- Array fields (repeatable field groups)

---

## TypeScript Definitions (Reference)

```typescript
type ValueType = "boolean" | "int" | "string" | "string_enum" | "string_multi"

type UIType = 
  | "checkbox" 
  | "text" 
  | "number" 
  | "select" 
  | "group_single" 
  | "prompts_multi" 
  | "status_single"

interface Field {
  key: string
  label?: string
  description?: string
  type: ValueType
  ui: UIType
  default?: boolean | number | string | string[]
  value?: boolean | number | string | string[]
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  visibleWhen?: {
    field: string
    equals: any
  }
  promptType?: string
}

interface Section {
  id?: string
  title?: string
  description?: string
  fields: Field[]
}

interface Schema {
  sections: Section[]
}
```

---

## Support & Questions

For issues or feature requests, consult the main application documentation or contact the development team.
