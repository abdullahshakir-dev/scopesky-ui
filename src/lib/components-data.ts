// Written guidance for every component page: overview, when to use, content,
// accessibility and keyboard. Props, types and defaults come from the code (registry.ts).

import type { WrittenDoc } from "./types";

export const categories = ["Actions","Inputs","Selection","Feedback","Navigation","Data display","Overlays","Layout","Conversation"] as const;

export const components: WrittenDoc[] = [
  {
    "slug": "button",
    "name": "Button",
    "category": "Actions",
    "description": "Triggers an action: submit a form, save, open a dialog.",
    "exports": [
      "Button"
    ],
    "overview": "Buttons start an action. Use one primary button per view for the main action, and secondary, tertiary or ghost buttons for everything else. Primary uses Blue 700 so white labels meet WCAG AA.",
    "props": [
      {
        "name": "kind",
        "description": "Visual emphasis."
      },
      {
        "name": "size",
        "description": "Height: 32 / 40 / 48 / 64 / 80px."
      }
    ],
    "usage": {
      "use": [
        "Primary: the single most important action in a view (Save, Submit, Continue).",
        "Secondary: an alternative next to the primary (Cancel, Back).",
        "Tertiary / ghost: low-emphasis actions, toolbars, table rows.",
        "Danger: destructive actions such as Delete or Revoke access."
      ],
      "avoid": [
        "More than one primary button in the same view.",
        "Buttons for navigation between pages: use Link.",
        "Vague labels like “OK”, “Yes” or “Click here”."
      ]
    },
    "content": [
      "Sentence case: “Save changes”, not “SAVE CHANGES”."
    ],
    "a11y": [
      "Renders a native <button>, so keyboard and screen-reader support come built in.",
      "Icon-only buttons still take a text label as children: it becomes the accessible name and tooltip.",
      "Disabled buttons are not focusable. Explain elsewhere why an action is unavailable.",
      "Primary uses Blue 700 (#006B9B): 5.9:1 with white text."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Activates the button"
      },
      {
        "key": "Tab",
        "action": "Moves focus to the next control"
      }
    ]
  },
  {
    "slug": "icon-button",
    "name": "Icon button",
    "category": "Actions",
    "description": "Square icon-only button with a tooltip label.",
    "exports": [
      "IconButton"
    ],
    "overview": "Icon buttons save space in toolbars and table rows. The label is required: it becomes the tooltip and the accessible name.",
    "props": [
      {
        "name": "kind",
        "description": "Visual emphasis."
      },
      {
        "name": "size",
        "description": "Square size: 32 / 40 / 48px."
      }
    ],
    "usage": {
      "use": [
        "Toolbars, table rows and headers where space is tight.",
        "Universally understood actions (edit, delete, share, close)."
      ],
      "avoid": [
        "Actions whose icon is ambiguous: use a Button with text.",
        "The primary action on a page."
      ]
    },
    "content": [],
    "a11y": [
      "label is mandatory: it’s the accessible name and the tooltip.",
      "The tooltip opens on hover and keyboard focus."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Activates the button"
      }
    ]
  },
  {
    "slug": "link",
    "name": "Link",
    "category": "Actions",
    "description": "Navigates to another page or resource.",
    "exports": [
      "Link"
    ],
    "overview": "Links move people to another page, section or resource. Use them inline inside text or on their own. Links use Blue 700 (5.9:1 on white).",
    "props": [
      {
        "name": "children",
        "description": "Link text. Describe the destination."
      },
      {
        "name": "inline",
        "description": "Underlined link inside a paragraph."
      },
      {
        "name": "href",
        "description": "Destination URL."
      }
    ],
    "usage": {
      "use": [
        "Navigating to another page or an external resource.",
        "Inline references inside body text."
      ],
      "avoid": [
        "Triggering actions like Save or Delete: use Button.",
        "Generic text such as “click here” or “read more”."
      ]
    },
    "content": [],
    "a11y": [
      "Link text must make sense out of context: screen-reader users often list all links on a page.",
      "Inline links are underlined, so they don’t rely on color alone (WCAG 1.4.1).",
      "Mark external links that open a new tab (e.g. “(opens in new tab)”)."
    ],
    "keyboard": [
      {
        "key": "Enter",
        "action": "Follows the link"
      }
    ]
  },
  {
    "slug": "menu-button",
    "name": "Menu button",
    "category": "Actions",
    "description": "A button that opens a menu, or a split combo button.",
    "exports": [
      "MenuButton",
      "ComboButton",
      "MenuItem",
      "MenuItemDivider"
    ],
    "overview": "action with a menu of alternatives (“Save” + “Save as draft”).",
    "props": [
      {
        "name": "label",
        "description": "Button text."
      },
      {
        "name": "kind",
        "description": "MenuButton emphasis."
      }
    ],
    "usage": {
      "use": [
        "Menu button: a set of related actions under one label (Export, Add).",
        "Combo button: one main action plus close alternatives."
      ],
      "avoid": [
        "Unrelated actions in one menu.",
        "Navigation menus: use the header or side nav."
      ]
    },
    "content": [],
    "a11y": [
      "Implements the ARIA menu button pattern.",
      "MenuItem kind=\"danger\" marks destructive items with color and must also be worded clearly."
    ],
    "keyboard": [
      {
        "key": "Enter / Space / ↓",
        "action": "Opens the menu"
      },
      {
        "key": "↑ / ↓",
        "action": "Moves between items"
      },
      {
        "key": "Esc",
        "action": "Closes the menu"
      }
    ]
  },
  {
    "slug": "overflow-menu",
    "name": "Overflow menu",
    "category": "Actions",
    "description": "A “⋯” menu for row and card actions.",
    "exports": [
      "OverflowMenu",
      "OverflowMenuItem"
    ],
    "overview": "Overflow menus hold secondary actions that don’t need to be visible all the time, such as row actions in a table. Put destructive actions last, with a divider.",
    "props": [],
    "usage": {
      "use": [
        "Row and card actions beyond the main one.",
        "Up to ~7 related actions."
      ],
      "avoid": [
        "The only way to reach a common action.",
        "Navigation: use links or tabs."
      ]
    },
    "content": [],
    "a11y": [
      "The trigger is a button with aria-haspopup and aria-expanded.",
      "Focus moves into the menu on open and back to the trigger on close."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Opens the menu"
      },
      {
        "key": "↑ / ↓",
        "action": "Moves between items"
      },
      {
        "key": "Esc",
        "action": "Closes and returns focus"
      }
    ]
  },
  {
    "slug": "copy-button",
    "name": "Copy button",
    "category": "Actions",
    "description": "Copies a value to the clipboard and confirms it.",
    "exports": [
      "CopyButton"
    ],
    "overview": "Copy buttons sit next to values people often paste elsewhere: reference numbers, API keys, account IDs. They show brief “Copied” feedback.",
    "props": [],
    "usage": {
      "use": [
        "IDs, reference numbers, codes and links people paste elsewhere."
      ],
      "avoid": [
        "Long content blocks: use Code snippet, which includes copy."
      ]
    },
    "content": [],
    "a11y": [
      "Feedback is announced to screen readers.",
      "Give label the thing being copied: “Copy reference number”."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Copies"
      }
    ]
  },
  {
    "slug": "button-group",
    "name": "Button group",
    "category": "Actions",
    "description": "Joins related buttons into one control.",
    "exports": [
      "ButtonGroup",
      "ButtonGroupSeparator",
      "ButtonGroupText"
    ],
    "overview": "Groups buttons that act on the same thing, with shared borders. Supports split buttons, icon groups, text addons and inputs, horizontally or vertically.",
    "props": [],
    "usage": {
      "use": [
        "Toolbars, split buttons, view switchers."
      ],
      "avoid": [
        "Unrelated actions: keep them apart."
      ]
    },
    "content": [],
    "a11y": [
      "role=\"group\" with an aria-label.",
      "Each button keeps its own focus ring."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves through the buttons"
      },
      {
        "key": "Enter / Space",
        "action": "Presses the focused button"
      }
    ]
  },
  {
    "slug": "toggle-button",
    "name": "Toggle button",
    "category": "Actions",
    "description": "A button that stays pressed or unpressed.",
    "exports": [
      "Toggle",
      "ToggleGroup",
      "ToggleGroupItem"
    ],
    "overview": "A two-state button for options such as bold or pin. On shows the Blue 50 fill and Deep Navy icon. ToggleGroup joins several, single or multiple.",
    "props": [
      {
        "name": "pressed",
        "description": "Controlled state."
      }
    ],
    "usage": {
      "use": [
        "Formatting, pinning, view options."
      ],
      "avoid": [
        "Settings that apply at once: use a Toggle switch."
      ]
    },
    "content": [],
    "a11y": [
      "aria-pressed tells the state.",
      "Icon-only toggles need aria-label."
    ],
    "keyboard": [
      {
        "key": "Space / Enter",
        "action": "Switches the state"
      },
      {
        "key": "← / →",
        "action": "Moves within a toggle group"
      }
    ]
  },
  {
    "slug": "text-input",
    "name": "Text input",
    "category": "Inputs",
    "description": "Single-line text entry: names, emails, phone numbers.",
    "exports": [
      "TextInput"
    ],
    "overview": "Text inputs collect short, single-line answers. Pair every input with a label, and use helper text for format hints.",
    "props": [
      {
        "name": "size",
        "description": "Height: 32 / 40 / 48px."
      },
      {
        "name": "invalid",
        "description": "Shows the error state."
      },
      {
        "name": "warn",
        "description": "Shows the warning state."
      }
    ],
    "usage": {
      "use": [
        "Short free-text answers: name, email, phone, ID numbers.",
        "When the answer can’t be picked from a short list."
      ],
      "avoid": [
        "Long answers: use Text area.",
        "A small set of known options: use Select, Dropdown or Radio buttons."
      ]
    },
    "content": [
      "Labels are nouns in sentence case: “Email address”.",
      "Put format hints in helper text: “Format: 07XX XXX XXXX”."
    ],
    "a11y": [
      "Every field needs a visible label (the label prop). Never rely on placeholder text as the label.",
      "Error and helper text are linked to the input with aria-describedby automatically.",
      "Error messages say how to fix the problem, not just that something is wrong.",
      "Use the right type (email, tel) so mobile users get the right keyboard."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves focus into and out of the field"
      }
    ]
  },
  {
    "slug": "password-input",
    "name": "Password input",
    "category": "Inputs",
    "description": "Masked field with a show / hide toggle.",
    "exports": [
      "PasswordInput"
    ],
    "overview": "Password inputs mask what people type and include a button to reveal it. Pass Arabic labels for the toggle in RTL pages.",
    "props": [
      {
        "name": "size",
        "description": "Height."
      },
      {
        "name": "invalid",
        "description": "Error state."
      }
    ],
    "usage": {
      "use": [
        "Sign-in, sign-up and password change forms."
      ],
      "avoid": [
        "Codes people need to read back, such as one-time passwords."
      ]
    },
    "content": [
      "State the password rules up front in helper text, not only after an error."
    ],
    "a11y": [
      "The show/hide button is labelled and announces the new state.",
      "Use autoComplete=\"current-password\" or \"new-password\" so password managers work."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves between field and show/hide button"
      }
    ]
  },
  {
    "slug": "text-area",
    "name": "Text area",
    "category": "Inputs",
    "description": "Multi-line text entry with an optional character counter.",
    "exports": [
      "TextArea"
    ],
    "overview": "Text areas collect longer answers such as messages, descriptions and feedback. Turn on the counter when there’s a limit.",
    "props": [
      {
        "name": "maxCount",
        "description": "Character limit for the counter."
      },
      {
        "name": "invalid",
        "description": "Shows the error state."
      }
    ],
    "usage": {
      "use": [
        "Messages, descriptions, comments, feedback."
      ],
      "avoid": [
        "Short single-line answers: use Text input."
      ]
    },
    "content": [],
    "a11y": [
      "Every field needs a visible label (the label prop). Never rely on placeholder text as the label.",
      "Error and helper text are linked to the input with aria-describedby automatically.",
      "Error messages say how to fix the problem, not just that something is wrong.",
      "The counter is announced to screen readers as the limit approaches."
    ],
    "keyboard": []
  },
  {
    "slug": "number-input",
    "name": "Number input",
    "category": "Inputs",
    "description": "Numeric entry with stepper buttons and min/max limits.",
    "exports": [
      "NumberInput"
    ],
    "overview": "Number inputs collect a numeric value within a range. The stepper buttons help with small adjustments; typing still works.",
    "props": [
      {
        "name": "label",
        "description": "Visible label."
      },
      {
        "name": "min",
        "description": "Minimum value."
      },
      {
        "name": "max",
        "description": "Maximum value."
      },
      {
        "name": "step",
        "description": "Stepper increment."
      }
    ],
    "usage": {
      "use": [
        "Quantities and counts within a known range."
      ],
      "avoid": [
        "Phone numbers, IDs or card numbers: use Text input (they aren’t quantities)."
      ]
    },
    "content": [],
    "a11y": [
      "Every field needs a visible label (the label prop). Never rely on placeholder text as the label.",
      "Error and helper text are linked to the input with aria-describedby automatically.",
      "Error messages say how to fix the problem, not just that something is wrong.",
      "Stepper buttons have accessible labels (“Increment number”, “Decrement number”)."
    ],
    "keyboard": [
      {
        "key": "↑ / ↓",
        "action": "Increase / decrease by step"
      },
      {
        "key": "Tab",
        "action": "Moves between the field and steppers"
      }
    ]
  },
  {
    "slug": "search",
    "name": "Search",
    "category": "Inputs",
    "description": "Search field with clear button; expandable version.",
    "exports": [
      "Search",
      "ExpandableSearch"
    ],
    "overview": "Search lets people find content by keyword. It includes a search icon and a clear button. Use it at the top of lists, tables and help centers. The expandable version starts as an icon and opens on click, for tight toolbars.",
    "props": [
      {
        "name": "placeholder",
        "description": "Placeholder text."
      },
      {
        "name": "size",
        "description": "Height."
      }
    ],
    "usage": {
      "use": [
        "Finding items in large lists, tables or help content."
      ],
      "avoid": [
        "Filtering a list of fewer than ~7 items: show them all instead."
      ]
    },
    "content": [],
    "a11y": [
      "label is required even when hideLabel hides it visually.",
      "The input uses role=\"searchbox\".",
      "Esc clears the field."
    ],
    "keyboard": [
      {
        "key": "Esc",
        "action": "Clears the search text"
      },
      {
        "key": "Enter",
        "action": "Submits (handle with onKeyDown)"
      }
    ]
  },
  {
    "slug": "combo-box",
    "name": "Combo box",
    "category": "Inputs",
    "description": "Dropdown with type-ahead for long lists.",
    "exports": [
      "ComboBox"
    ],
    "overview": "Combo boxes let people type to filter a long list, then pick one option. Use them when a Dropdown would have more than ~15 items, such as cities or branches.",
    "props": [
      {
        "name": "placeholder",
        "description": "Placeholder text."
      }
    ],
    "usage": {
      "use": [
        "Long lists (15+): cities, branches, countries.",
        "When people know what they’re looking for and want to type it."
      ],
      "avoid": [
        "Short lists: use Dropdown or Radio buttons."
      ]
    },
    "content": [],
    "a11y": [
      "Implements the ARIA combobox pattern with a listbox popup.",
      "Filtering works with Arabic text too; test with your real data."
    ],
    "keyboard": [
      {
        "key": "Type",
        "action": "Filters the list"
      },
      {
        "key": "↑ / ↓",
        "action": "Moves between options"
      },
      {
        "key": "Enter",
        "action": "Selects"
      },
      {
        "key": "Esc",
        "action": "Closes, then clears"
      }
    ]
  },
  {
    "slug": "multiselect",
    "name": "Multiselect",
    "category": "Inputs",
    "description": "Pick several options, optionally filterable.",
    "exports": [
      "MultiSelect",
      "FilterableMultiSelect"
    ],
    "overview": "Multiselects let people pick several options from a list. The filterable version adds type-ahead. Selected items show as a count tag that clears all.",
    "props": [
      {
        "name": "label",
        "description": "Placeholder text (MultiSelect) / placeholder (filterable)."
      }
    ],
    "usage": {
      "use": [
        "Filters with several values (status, city, service).",
        "Forms where several options can apply."
      ],
      "avoid": [
        "2–5 options always visible: use Checkboxes."
      ]
    },
    "content": [],
    "a11y": [
      "Each option is a checkbox in a listbox; selection count is announced.",
      "The clear-selection tag is a labelled button."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Opens; toggles the highlighted option"
      },
      {
        "key": "↑ / ↓",
        "action": "Moves between options"
      },
      {
        "key": "Esc",
        "action": "Closes"
      }
    ]
  },
  {
    "slug": "date-picker",
    "name": "Date picker",
    "category": "Inputs",
    "description": "Pick a single date or a date range from a calendar.",
    "exports": [
      "DatePicker",
      "DatePickerInput"
    ],
    "overview": "Date pickers let people type a date or pick one from a calendar. Use the range type for start and end dates. In RTL the calendar switches to Arabic month names.",
    "props": [],
    "usage": {
      "use": [
        "Dates close to today: appointments, bookings, deadlines.",
        "Ranges: report periods, leave requests."
      ],
      "avoid": [
        "Dates far in the past such as date of birth: three Selects or a typed field are faster."
      ]
    },
    "content": [
      "Show the expected format in the placeholder: dd/mm/yyyy.",
      "Iraq uses day/month/year order."
    ],
    "a11y": [
      "People can always type the date; the calendar is optional.",
      "The calendar supports arrow-key navigation.",
      "Give range inputs distinct labels (“Start date”, “End date”)."
    ],
    "keyboard": [
      {
        "key": "Arrow keys",
        "action": "Move between days"
      },
      {
        "key": "Enter",
        "action": "Selects the focused day"
      },
      {
        "key": "Esc",
        "action": "Closes the calendar"
      }
    ]
  },
  {
    "slug": "time-picker",
    "name": "Time picker",
    "category": "Inputs",
    "description": "Time field with AM/PM and time zone.",
    "exports": [
      "TimePicker",
      "TimePickerSelect",
      "SelectItem"
    ],
    "overview": "AM / PM.",
    "props": [],
    "usage": {
      "use": [
        "Appointment and booking times.",
        "Scheduling notifications or maintenance windows."
      ],
      "avoid": [
        "Durations: use Number input with a unit."
      ]
    },
    "content": [],
    "a11y": [
      "Each select has its own label (visually hidden).",
      "Validate the typed format and explain it in the error."
    ],
    "keyboard": []
  },
  {
    "slug": "slider",
    "name": "Slider",
    "category": "Inputs",
    "description": "Pick a value in a range by dragging or typing.",
    "exports": [
      "Slider"
    ],
    "overview": "Sliders pick a number in a range, such as a speed or a budget. The paired number field lets people type an exact value.",
    "props": [
      {
        "name": "min",
        "description": "Minimum."
      },
      {
        "name": "max",
        "description": "Maximum."
      }
    ],
    "usage": {
      "use": [
        "Approximate values in a known range: speed, budget, quantity."
      ],
      "avoid": [
        "Exact values with many digits: use Number input."
      ]
    },
    "content": [],
    "a11y": [
      "The handle uses role=\"slider\" with aria-valuemin/max/now.",
      "Keep the text input visible unless the exact value doesn’t matter."
    ],
    "keyboard": [
      {
        "key": "Shift + ← / →",
        "action": "Larger steps"
      },
      {
        "key": "Home / End",
        "action": "Minimum / maximum"
      }
    ]
  },
  {
    "slug": "file-uploader",
    "name": "File uploader",
    "category": "Inputs",
    "description": "Upload documents with a button or drop zone.",
    "exports": [
      "FileUploader",
      "FileUploaderDropContainer",
      "FileUploaderItem"
    ],
    "overview": "File uploaders collect documents such as ID scans and bills. Show each file with its status (uploading, complete, error) and state limits up front.",
    "props": [],
    "usage": {
      "use": [
        "Documents attached to an application or request."
      ],
      "avoid": [
        "Images people need to crop or edit: use a dedicated editor."
      ]
    },
    "content": [
      "Say the limits before upload: size, number and file types.",
      "Error text says what to do next."
    ],
    "a11y": [
      "The drop zone is also a button, so keyboard users can open the file browser.",
      "Status changes (uploading, complete, error) are announced."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Opens the file browser from the drop zone or button"
      }
    ]
  },
  {
    "slug": "form-group",
    "name": "Form group",
    "category": "Inputs",
    "description": "Groups related fields under a legend.",
    "exports": [
      "Form",
      "FormGroup",
      "Stack",
      "TextInput",
      "Button"
    ],
    "overview": "Form and FormGroup structure a form: FormGroup renders a fieldset with a legend, so related fields (contact details, address) are announced together. Stack controls the spacing.",
    "props": [],
    "usage": {
      "use": [
        "Any form with more than a few fields.",
        "Grouping related fields: contact, address, payment."
      ],
      "avoid": [
        "Wrapping a single field in a group."
      ]
    },
    "content": [
      "Mark the few optional fields as “(optional)” instead of starring every required one."
    ],
    "a11y": [
      "FormGroup renders <fieldset> + <legend>, so screen readers announce the group name.",
      "Disabled on FormGroup disables all fields inside."
    ],
    "keyboard": []
  },
  {
    "slug": "fluid-form",
    "name": "Fluid form",
    "category": "Inputs",
    "description": "Compact form with labels inside the fields.",
    "exports": [
      "FluidForm",
      "TextInput"
    ],
    "overview": "Fluid forms place labels inside the fields and stack inputs with 1px dividers. Use them for dense, focused tasks such as sign-in or checkout, not long forms.",
    "props": [],
    "usage": {
      "use": [
        "Short, focused forms (2–5 fields).",
        "Layouts where vertical space matters."
      ],
      "avoid": [
        "Long forms: the default style is easier to scan.",
        "Mixing fluid and default fields on one page."
      ]
    },
    "content": [],
    "a11y": [
      "Labels stay visible inside the field after typing, so context isn’t lost.",
      "Error text appears inside the field area and is linked to the input."
    ],
    "keyboard": []
  },
  {
    "slug": "input-group",
    "name": "Input group",
    "category": "Inputs",
    "description": "An input with icons, text, buttons or a toolbar attached.",
    "exports": [
      "InputGroup",
      "InputGroupAddon",
      "InputGroupInput",
      "InputGroupButton",
      "InputGroupText"
    ],
    "overview": "Adds content around an input or textarea: a search icon, a result count, prefixes like https://, a Copy button, or a toolbar under a message box. Addons can sit at the start, end, top or bottom.",
    "props": [],
    "usage": {
      "use": [
        "Search, URLs, codes to copy, chat composers."
      ],
      "avoid": [
        "Labels: use a real <label> above the field."
      ]
    },
    "content": [],
    "a11y": [
      "Addon icons are decorative; buttons get aria-labels.",
      "The field keeps one visible label."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves from the input to its buttons"
      }
    ]
  },
  {
    "slug": "input-otp",
    "name": "Input OTP",
    "category": "Inputs",
    "description": "One-time code entry, one digit per box.",
    "exports": [
      "InputOTP",
      "InputOTPGroup",
      "InputOTPSlot",
      "InputOTPSeparator"
    ],
    "overview": "Enter a verification code sent by SMS or email. Digits move to the next box as you type, paste fills every box, and the code always reads left to right, also in Arabic.",
    "props": [],
    "usage": {
      "use": [
        "Sign-in and payment verification."
      ],
      "avoid": [
        "Passwords or long codes."
      ]
    },
    "content": [],
    "a11y": [
      "autocomplete=\"one-time-code\" lets phones fill it.",
      "Errors are announced, not just shown in red."
    ],
    "keyboard": [
      {
        "key": "0–9",
        "action": "Types into the active box"
      },
      {
        "key": "Backspace",
        "action": "Clears and moves back"
      },
      {
        "key": "← / →",
        "action": "Moves between boxes"
      }
    ]
  },
  {
    "slug": "questionnaire",
    "name": "Questionnaire",
    "category": "Inputs",
    "description": "Asks questions one at a time, with progress and navigation.",
    "exports": [
      "Questionnaire",
      "QuestionnaireProgress",
      "QuestionnaireItem",
      "QuestionnaireChoice",
      "QuestionnaireActions"
    ],
    "overview": "A multi-step form for surveys and onboarding. Each item is a fieldset with single or multiple choices, a free-text answer, validation and Previous, Skip and Next.",
    "props": [],
    "usage": {
      "use": [
        "Surveys, onboarding and service questions."
      ],
      "avoid": [
        "Short forms that fit on one screen."
      ]
    },
    "content": [],
    "a11y": [
      "Each item is a fieldset with a legend.",
      "Progress is a labelled progressbar; errors focus the answer."
    ],
    "keyboard": [
      {
        "key": "A / B / C",
        "action": "Picks a choice (letter shortcuts)"
      },
      {
        "key": "Enter",
        "action": "Goes to the next question"
      }
    ]
  },
  {
    "slug": "dropdown",
    "name": "Dropdown",
    "category": "Selection",
    "description": "Pick one option from a styled list.",
    "exports": [
      "Dropdown"
    ],
    "overview": "Dropdowns let people choose one option from a list of 4–15 items. For forms that must work without JavaScript or on mobile-native pickers, use Select.",
    "props": [
      {
        "name": "label",
        "description": "Text shown before a selection is made. Required."
      }
    ],
    "usage": {
      "use": [
        "Choosing one option from 4–15 items.",
        "Filters and settings where space is tight."
      ],
      "avoid": [
        "2–3 options: use Radio buttons so all choices are visible.",
        "Long lists (15+): use a ComboBox with type-ahead."
      ]
    },
    "content": [],
    "a11y": [
      "Implements the ARIA listbox pattern with full keyboard support.",
      "label is both the visible label and the accessible name."
    ],
    "keyboard": [
      {
        "key": "Enter / Space / ↓",
        "action": "Opens the menu"
      },
      {
        "key": "↑ / ↓",
        "action": "Moves between options"
      },
      {
        "key": "Enter",
        "action": "Selects the highlighted option"
      },
      {
        "key": "Esc",
        "action": "Closes the menu"
      }
    ]
  },
  {
    "slug": "select",
    "name": "Select",
    "category": "Selection",
    "description": "Native select for picking one option in forms.",
    "exports": [
      "Select",
      "SelectItem"
    ],
    "overview": "Select wraps the native <select> element. It works everywhere, opens the platform picker on phones and needs no JavaScript to submit with a form.",
    "props": [],
    "usage": {
      "use": [
        "Form fields with a known list of options.",
        "Mobile-heavy pages: phones show their native picker."
      ],
      "avoid": [
        "When options need icons or descriptions: use Dropdown."
      ]
    },
    "content": [],
    "a11y": [
      "Native element: the most robust option for assistive technology.",
      "Use a disabled, hidden first option as the prompt instead of a fake selected value."
    ],
    "keyboard": [
      {
        "key": "↑ / ↓",
        "action": "Changes the selection"
      },
      {
        "key": "Space / Alt + ↓",
        "action": "Opens the native list"
      }
    ]
  },
  {
    "slug": "checkbox",
    "name": "Checkbox",
    "category": "Selection",
    "description": "Select zero, one or several options.",
    "exports": [
      "Checkbox",
      "CheckboxGroup"
    ],
    "overview": "Checkboxes let people turn options on or off independently. Group related checkboxes with a legend. A single checkbox works for consent (“I agree to the terms”).",
    "props": [
      {
        "name": "disabled",
        "description": "Disables every checkbox (set on each Checkbox)."
      },
      {
        "name": "indeterminate",
        "description": "Mixed state for “select all”."
      },
      {
        "name": "onChange",
        "description": "Change handler."
      }
    ],
    "usage": {
      "use": [
        "Multiple independent choices.",
        "A single opt-in such as accepting terms."
      ],
      "avoid": [
        "Mutually exclusive choices: use Radio buttons.",
        "Settings that apply immediately: use Toggle."
      ]
    },
    "content": [],
    "a11y": [
      "CheckboxGroup renders a fieldset with a legend, so the group is announced.",
      "The whole label is clickable."
    ],
    "keyboard": [
      {
        "key": "Space",
        "action": "Toggles the focused checkbox"
      },
      {
        "key": "Tab",
        "action": "Moves to the next checkbox"
      }
    ]
  },
  {
    "slug": "radio-button",
    "name": "Radio button",
    "category": "Selection",
    "description": "Pick exactly one option, with all choices visible.",
    "exports": [
      "RadioButtonGroup",
      "RadioButton"
    ],
    "overview": "Radio buttons show every option at once and allow exactly one selection. Preselect the most common option when it’s safe to do so.",
    "props": [
      {
        "name": "orientation",
        "description": "Layout of the options."
      },
      {
        "name": "onChange",
        "description": "Selection handler."
      }
    ],
    "usage": {
      "use": [
        "2–5 mutually exclusive options that people should compare."
      ],
      "avoid": [
        "More than ~6 options: use Select or Dropdown.",
        "Turning a single setting on/off: use Toggle or Checkbox."
      ]
    },
    "content": [],
    "a11y": [
      "Rendered as a fieldset with a legend.",
      "Arrow keys move selection within the group; Tab leaves the group."
    ],
    "keyboard": [
      {
        "key": "↑ / ↓ / ← / →",
        "action": "Selects the previous / next option"
      },
      {
        "key": "Tab",
        "action": "Moves focus out of the group"
      }
    ]
  },
  {
    "slug": "toggle",
    "name": "Toggle",
    "category": "Selection",
    "description": "Switch a setting on or off, taking effect immediately.",
    "exports": [
      "Toggle"
    ],
    "overview": "Toggles switch a single setting on or off and apply the change right away, like a light switch. If the change needs a Save button, use a Checkbox.",
    "props": [
      {
        "name": "size",
        "description": "Switch size."
      },
      {
        "name": "disabled",
        "description": "Disables the toggle."
      }
    ],
    "usage": {
      "use": [
        "Settings that apply instantly: notifications, dark mode, auto-renew."
      ],
      "avoid": [
        "Form fields submitted with a button: use Checkbox."
      ]
    },
    "content": [],
    "a11y": [
      "Uses role=\"switch\" with aria-checked.",
      "Keep label even when hidden; it’s the accessible name."
    ],
    "keyboard": [
      {
        "key": "Space / Enter",
        "action": "Toggles the switch"
      }
    ]
  },
  {
    "slug": "content-switcher",
    "name": "Content switcher",
    "category": "Selection",
    "description": "Switch between views of the same content.",
    "exports": [
      "ContentSwitcher",
      "Switch"
    ],
    "overview": "Content switchers swap between alternate views of the same data, like Day / Week / Month on a usage chart. Unlike tabs, the content stays the same, only its presentation changes.",
    "props": [],
    "usage": {
      "use": [
        "Alternate views of the same content (list / grid, day / week)."
      ],
      "avoid": [
        "Different content sections: use Tabs.",
        "Form choices: use Radio buttons."
      ]
    },
    "content": [],
    "a11y": [
      "Implements a tablist with tabs; the selected switch has aria-selected."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Selects"
      }
    ]
  },
  {
    "slug": "notification",
    "name": "Notification",
    "category": "Feedback",
    "description": "Inline, toast and actionable status messages.",
    "exports": [
      "InlineNotification",
      "ToastNotification",
      "ActionableNotification"
    ],
    "overview": "Notifications tell people about system status: success, errors, warnings and information. Inline notifications sit in the page near the related content; toasts float briefly; actionable notifications offer a next step.",
    "props": [
      {
        "name": "kind",
        "description": "Status type (icon and color)."
      },
      {
        "name": "title",
        "description": "Short, bold message."
      },
      {
        "name": "subtitle",
        "description": "Supporting detail."
      },
      {
        "name": "lowContrast",
        "description": "Light background style. Use inside pages."
      },
      {
        "name": "onClose",
        "description": "Return false to keep it open."
      }
    ],
    "usage": {
      "use": [
        "Inline: form-level errors, page status, info related to nearby content.",
        "Toast: confirmation of a completed background action (“Settings saved”).",
        "Actionable: when there’s an obvious next step (“Update payment method”)."
      ],
      "avoid": [
        "Field-level errors: use the field’s invalid prop.",
        "Critical decisions: use a Modal."
      ]
    },
    "content": [
      "Title says what happened; subtitle says what to do next.",
      "Keep toasts under ~10 words."
    ],
    "a11y": [
      "Error and warning kinds use role=\"alert\"; info and success use role=\"status\".",
      "Status is shown with an icon as well as color.",
      "Don’t auto-dismiss toasts that contain actions."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Reaches the action and close buttons"
      }
    ]
  },
  {
    "slug": "modal",
    "name": "Modal",
    "category": "Feedback",
    "description": "Dialog that interrupts to confirm a decision.",
    "exports": [
      "Modal",
      "Button"
    ],
    "overview": "Modals interrupt the current task for a decision or short focused input. Keep them rare: every modal blocks the page. Danger modals confirm destructive actions.",
    "props": [
      {
        "name": "size",
        "description": "Width."
      },
      {
        "name": "danger",
        "description": "Destructive styling for the primary button."
      },
      {
        "name": "open",
        "description": "Controls visibility."
      }
    ],
    "usage": {
      "use": [
        "Confirming destructive or irreversible actions.",
        "Short, focused input that must happen before continuing."
      ],
      "avoid": [
        "Long forms or complex flows: use a full page.",
        "Information people might want to reference while working: use inline content."
      ]
    },
    "content": [
      "Heading is a question for confirmations: “Delete this record?”.",
      "Primary button repeats the action verb: “Delete”, not “Yes”."
    ],
    "a11y": [
      "Focus moves into the modal on open and is trapped until it closes.",
      "Focus returns to the trigger button on close.",
      "Esc closes the modal; the heading labels the dialog."
    ],
    "keyboard": [
      {
        "key": "Esc",
        "action": "Closes the modal"
      },
      {
        "key": "Tab / Shift + Tab",
        "action": "Cycles through controls inside the modal"
      },
      {
        "key": "Enter",
        "action": "Activates the focused button"
      }
    ]
  },
  {
    "slug": "progress-bar",
    "name": "Progress bar",
    "category": "Feedback",
    "description": "Shows progress of uploads and long tasks.",
    "exports": [
      "ProgressBar"
    ],
    "overview": "Progress bars show how far along a task is. Use a value when progress is known; leave it empty for an animated indeterminate bar.",
    "props": [
      {
        "name": "label",
        "description": "What is in progress."
      },
      {
        "name": "value",
        "description": "Current value (0–max)."
      },
      {
        "name": "status",
        "description": "Finished and error show an icon."
      },
      {
        "name": "size",
        "description": "Bar thickness."
      }
    ],
    "usage": {
      "use": [
        "Uploads, downloads, imports and other tasks over ~2 seconds."
      ],
      "avoid": [
        "Short waits under a second: show nothing.",
        "Multi-step forms: use a ProgressIndicator (steps)."
      ]
    },
    "content": [],
    "a11y": [
      "Uses role=\"progressbar\" with aria-valuenow, aria-valuemin and aria-valuemax.",
      "Status changes are announced via the helper text."
    ],
    "keyboard": []
  },
  {
    "slug": "progress-indicator",
    "name": "Progress indicator",
    "category": "Feedback",
    "description": "Steps of a multi-step process.",
    "exports": [
      "ProgressIndicator",
      "ProgressStep"
    ],
    "overview": "Progress indicators show progress through a multi-step flow such as a subscription request. Completed steps show a check; the current step is highlighted.",
    "props": [
      {
        "name": "vertical",
        "description": "Vertical layout."
      }
    ],
    "usage": {
      "use": [
        "Multi-step forms with 3–6 steps."
      ],
      "avoid": [
        "Single-page forms.",
        "Loading progress: use Progress bar."
      ]
    },
    "content": [
      "Step labels are short nouns or verbs: “Documents”, “Review”."
    ],
    "a11y": [
      "Each step announces its state (complete, current, incomplete, invalid).",
      "Steps can be made clickable with onChange on ProgressIndicator."
    ],
    "keyboard": []
  },
  {
    "slug": "loading",
    "name": "Loading",
    "category": "Feedback",
    "description": "Spinner and inline loading states for short waits.",
    "exports": [
      "InlineLoading",
      "Loading"
    ],
    "overview": "Loading indicators show that something is happening. Use InlineLoading next to the button or field that started the action, and the spinner for page or section loads.",
    "props": [],
    "usage": {
      "use": [
        "InlineLoading: after submitting a form or saving a setting.",
        "Spinner: loading a section whose layout is unknown."
      ],
      "avoid": [
        "Known-length tasks: use Progress bar.",
        "Full-page spinners when a skeleton of the layout is possible."
      ]
    },
    "content": [],
    "a11y": [
      "InlineLoading announces its description through a live region.",
      "Always provide a description; “Loading” alone gives no context."
    ],
    "keyboard": []
  },
  {
    "slug": "skeleton",
    "name": "Skeleton",
    "category": "Feedback",
    "description": "Grey placeholders while content loads.",
    "exports": [
      "SkeletonText",
      "SkeletonPlaceholder",
      "ButtonSkeleton",
      "TextInputSkeleton",
      "DataTableSkeleton"
    ],
    "overview": "Skeletons show the shape of content while it loads, so the page doesn’t jump when data arrives. Every main component has a skeleton version.",
    "props": [],
    "usage": {
      "use": [
        "First load of pages, cards and tables.",
        "Content whose layout is known in advance."
      ],
      "avoid": [
        "Loading after a user action (saving): use InlineLoading.",
        "Very fast loads (< 300ms): show nothing."
      ]
    },
    "content": [],
    "a11y": [
      "Skeletons are decorative; announce loading separately (e.g. aria-busy on the region)."
    ],
    "keyboard": []
  },
  {
    "slug": "tooltip",
    "name": "Tooltip",
    "category": "Feedback",
    "description": "Short helper text on hover or focus.",
    "exports": [
      "Tooltip"
    ],
    "overview": "Tooltips show brief, supplementary text when a control is hovered or focused. Never hide information people need to complete a task inside a tooltip.",
    "props": [
      {
        "name": "label",
        "description": "Tooltip text (also the trigger’s accessible label)."
      }
    ],
    "usage": {
      "use": [
        "Labels for icon-only controls.",
        "Short definitions of unfamiliar terms."
      ],
      "avoid": [
        "Essential instructions or error messages.",
        "Interactive content such as links: use Toggletip."
      ]
    },
    "content": [],
    "a11y": [
      "The trigger must be focusable (a <button>), so keyboard users can open it.",
      "Opens on focus as well as hover; Esc closes it.",
      "Touch devices have no hover: don’t put required information in tooltips."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Focus the trigger to show the tooltip"
      },
      {
        "key": "Esc",
        "action": "Hides the tooltip"
      }
    ]
  },
  {
    "slug": "toggletip",
    "name": "Toggletip",
    "category": "Feedback",
    "description": "Click-to-open bubble with links and buttons.",
    "exports": [
      "Toggletip",
      "ToggletipButton",
      "ToggletipContent",
      "ToggletipActions"
    ],
    "overview": "Toggletips open on click and stay open, so they can hold a link or a button. Use them instead of a Tooltip when the extra information is interactive.",
    "props": [],
    "usage": {
      "use": [
        "Extra information with a link or action.",
        "Definitions people may want to keep open while reading."
      ],
      "avoid": [
        "Short labels for icon buttons: use Tooltip.",
        "Essential instructions: show them on the page."
      ]
    },
    "content": [],
    "a11y": [
      "The trigger is a button with aria-expanded.",
      "Focus stays on the trigger; Tab moves into the content’s actions.",
      "Esc closes it."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Opens / closes"
      },
      {
        "key": "Esc",
        "action": "Closes"
      }
    ]
  },
  {
    "slug": "definition-tooltip",
    "name": "Definition tooltip",
    "category": "Feedback",
    "description": "Explains a term inline.",
    "exports": [
      "DefinitionTooltip"
    ],
    "overview": "Definition tooltips explain jargon inline, such as “FTTH” or “static IP”, without sending people elsewhere.",
    "props": [
      {
        "name": "definition",
        "description": "Explanation shown in the tooltip."
      }
    ],
    "usage": {
      "use": [
        "Technical terms and abbreviations in body text."
      ],
      "avoid": [
        "Long explanations: link to a help article.",
        "Interactive content: use Toggletip."
      ]
    },
    "content": [],
    "a11y": [
      "The term is a button, so it’s reachable by keyboard; the definition is linked with aria-describedby."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Focuses the term and opens the definition"
      },
      {
        "key": "Esc",
        "action": "Closes"
      }
    ]
  },
  {
    "slug": "popover",
    "name": "Popover",
    "category": "Feedback",
    "description": "Floating panel anchored to a trigger.",
    "exports": [
      "Popover",
      "PopoverContent"
    ],
    "overview": "Popover is the building block behind tooltips and toggletips. Use it for custom floating content such as a small settings panel. You control when it opens.",
    "props": [
      {
        "name": "align",
        "description": "Position."
      },
      {
        "name": "caret",
        "description": "Shows the pointer."
      }
    ],
    "usage": {
      "use": [
        "Custom floating panels: settings, filters, previews."
      ],
      "avoid": [
        "Plain hints: use Tooltip or Toggletip, which handle behavior for you."
      ]
    },
    "content": [],
    "a11y": [
      "You own the behavior: set aria-expanded on the trigger and close on Esc / outside click (onRequestClose).",
      "Keep focusable content reachable by keyboard."
    ],
    "keyboard": []
  },
  {
    "slug": "ai-label",
    "name": "AI label",
    "category": "Feedback",
    "description": "Marks AI-generated content and explains it.",
    "exports": [
      "AILabel",
      "AILabelContent",
      "AILabelActions"
    ],
    "overview": "A small “AI” button placed next to content that the ScopeSky assistant wrote or changed. Selecting it opens a popover that says what the AI did, which data it used and how sure it is, with actions to review or revert. Use the same label everywhere AI is involved so people learn to recognise it.",
    "props": [
      {
        "name": "size",
        "description": "Size of the label button."
      }
    ],
    "usage": {
      "use": [
        "Text, values or suggestions that AI wrote or changed.",
        "Fields the assistant filled in for the user."
      ],
      "avoid": [
        "Features that do not use AI.",
        "Replacing a clear explanation on the page itself."
      ]
    },
    "content": [],
    "a11y": [
      "The label is a button with an accessible name such as “AI explained”.",
      "The popover is a dialog: focus moves into it and returns to the label when it closes.",
      "The “AI” text carries the meaning; the gradient border is decoration only."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Opens or closes the explanation"
      },
      {
        "key": "Tab",
        "action": "Moves through the actions inside it"
      },
      {
        "key": "Esc",
        "action": "Closes it and returns focus to the label"
      }
    ]
  },
  {
    "slug": "empty",
    "name": "Empty",
    "category": "Feedback",
    "description": "Tells people there is nothing here yet, and what to do next.",
    "exports": [
      "Empty",
      "EmptyMedia",
      "EmptyTitle",
      "EmptyDescription",
      "EmptyContent"
    ],
    "overview": "An empty state with an icon, a title, one sentence and the next step. Use it for first use, cleared filters and no search results.",
    "props": [],
    "usage": {
      "use": [
        "First use, empty tables, no search results."
      ],
      "avoid": [
        "Errors: use a Notification with the cause."
      ]
    },
    "content": [],
    "a11y": [
      "The title is a heading at the right level.",
      "The icon is decorative (aria-hidden)."
    ],
    "keyboard": []
  },
  {
    "slug": "ui-shell",
    "name": "UI shell",
    "category": "Navigation",
    "description": "Header, top nav and side nav for a portal.",
    "exports": [
      "Carbon v11",
      "SideNav",
      "Header",
      "HeaderName",
      "HeaderNavigation",
      "HeaderMenuItem",
      "HeaderGlobalBar"
    ],
    "overview": "The UI shell is the frame of a product: a header with the product name, top navigation and global actions, plus an optional side navigation. This dashboard itself is built with it.",
    "props": [],
    "usage": {
      "use": [
        "Every ScopeSky portal and admin site.",
        "Side nav for apps with many sections; top nav for marketing sites with few."
      ],
      "avoid": [
        "More than ~7 top-level header links: move them into the side nav."
      ]
    },
    "content": [
      "Product name: “ScopeSky” prefix + short product name.",
      "In RTL the whole shell mirrors: name on the right, actions on the left."
    ],
    "a11y": [
      "Add SkipToContent as the first child of Header.",
      "HeaderGlobalAction needs aria-label; it also becomes the tooltip.",
      "The header is a banner landmark; side nav is a navigation landmark."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Skip link → name → nav links → actions"
      },
      {
        "key": "Enter",
        "action": "Opens header menus"
      }
    ]
  },
  {
    "slug": "tabs",
    "name": "Tabs",
    "category": "Navigation",
    "description": "Switch between related views on the same page.",
    "exports": [
      "Tabs",
      "TabList",
      "Tab",
      "TabPanels",
      "TabPanel"
    ],
    "overview": "Tabs organize related content into views at the same level. Line tabs suit page sections; contained tabs suit panels and cards.",
    "props": [],
    "usage": {
      "use": [
        "2–6 related views of the same subject.",
        "Content people switch between without losing context."
      ],
      "avoid": [
        "Sequential steps: use a progress indicator.",
        "Navigating to different pages: use the side nav or links."
      ]
    },
    "content": [
      "One or two words per tab.",
      "Tab order mirrors automatically in RTL."
    ],
    "a11y": [
      "Implements the ARIA tabs pattern (tablist, tab, tabpanel).",
      "The label prop names the tab list for screen readers."
    ],
    "keyboard": [
      {
        "key": "Home / End",
        "action": "First / last tab"
      },
      {
        "key": "Tab",
        "action": "Moves into the active panel"
      }
    ]
  },
  {
    "slug": "breadcrumb",
    "name": "Breadcrumb",
    "category": "Navigation",
    "description": "Shows where a page sits in the site hierarchy.",
    "exports": [
      "Breadcrumb",
      "BreadcrumbItem"
    ],
    "overview": "Breadcrumbs show the path to the current page and let people jump back up the hierarchy. Place them above the page title.",
    "props": [
      {
        "name": "noTrailingSlash",
        "description": "Removes the slash after the last item."
      }
    ],
    "usage": {
      "use": [
        "Sites with 3+ levels of hierarchy."
      ],
      "avoid": [
        "Flat sites or single-level pages.",
        "Showing step progress: use a progress indicator."
      ]
    },
    "content": [],
    "a11y": [
      "Rendered as a nav with aria-label=\"Breadcrumb\".",
      "The current page gets aria-current=\"page\".",
      "Separators mirror automatically in RTL."
    ],
    "keyboard": []
  },
  {
    "slug": "pagination",
    "name": "Pagination",
    "category": "Navigation",
    "description": "Splits long lists and tables into pages.",
    "exports": [
      "Pagination"
    ],
    "overview": "Pagination splits large data sets into pages and lets people change the page size. It usually sits directly under a data table.",
    "props": [],
    "usage": {
      "use": [
        "Tables and lists with more than one page of results."
      ],
      "avoid": [
        "Fewer than ~25 items: show them all.",
        "Feeds people scroll casually: consider “Load more”."
      ]
    },
    "content": [
      "Arrows and layout mirror in Arabic. The “Items per page” text is English for now, so check the copy on Arabic pages."
    ],
    "a11y": [
      "Previous/next buttons have accessible labels (backwardText, forwardText).",
      "The page select is a native select with a label."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves through page-size select, page select and arrows"
      }
    ]
  },
  {
    "slug": "pagination-nav",
    "name": "Pagination nav",
    "category": "Navigation",
    "description": "Numbered page links for results and articles.",
    "exports": [
      "PaginationNav"
    ],
    "overview": "Pagination nav shows numbered pages, like search results or news listings. Use Pagination (with page size) for data tables instead.",
    "props": [],
    "usage": {
      "use": [
        "Search results, news and article listings."
      ],
      "avoid": [
        "Data tables: use Pagination, which includes page size."
      ]
    },
    "content": [],
    "a11y": [
      "Rendered as a nav with aria-label; the current page has aria-current=\"page\".",
      "Collapsed ranges are a labelled select."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves between previous, page numbers and next"
      }
    ]
  },
  {
    "slug": "command",
    "name": "Command",
    "category": "Navigation",
    "description": "A searchable list of commands and places.",
    "exports": [
      "Command",
      "CommandInput",
      "CommandList",
      "CommandGroup",
      "CommandItem"
    ],
    "overview": "A fast, filterable menu. Type to narrow the list, move with the arrow keys and press Enter. Open it in a dialog with Ctrl + K to give power users a shortcut to everything.",
    "props": [],
    "usage": {
      "use": [
        "Global search, quick actions, switching accounts."
      ],
      "avoid": [
        "The only way to reach a feature."
      ]
    },
    "content": [],
    "a11y": [
      "role=\"combobox\" with a listbox of options.",
      "The active item is announced as you move."
    ],
    "keyboard": [
      {
        "key": "↑ / ↓",
        "action": "Moves through items"
      },
      {
        "key": "Enter",
        "action": "Runs the highlighted item"
      },
      {
        "key": "Esc",
        "action": "Closes the palette"
      }
    ]
  },
  {
    "slug": "context-menu",
    "name": "Context menu",
    "category": "Navigation",
    "description": "A menu that opens on right-click or long-press.",
    "exports": [
      "ContextMenu",
      "ContextMenuTrigger",
      "ContextMenuContent",
      "ContextMenuItem"
    ],
    "overview": "Shows actions for the thing under the pointer. Supports shortcuts, sub menus, checkbox and radio items, labels and separators. Always offer the same actions elsewhere too.",
    "props": [],
    "usage": {
      "use": [
        "Power-user shortcuts on rows, files and maps."
      ],
      "avoid": [
        "Actions that exist only here."
      ]
    },
    "content": [],
    "a11y": [
      "role=\"menu\" with menuitem, menuitemcheckbox and menuitemradio.",
      "Shift + F10 opens it from the keyboard."
    ],
    "keyboard": [
      {
        "key": "Shift + F10",
        "action": "Opens the menu"
      },
      {
        "key": "↑ / ↓",
        "action": "Moves through items"
      },
      {
        "key": "→ / ←",
        "action": "Opens or closes a sub menu"
      }
    ]
  },
  {
    "slug": "menubar",
    "name": "Menubar",
    "category": "Navigation",
    "description": "A horizontal bar of menus, like a desktop app.",
    "exports": [
      "Menubar",
      "MenubarMenu",
      "MenubarTrigger",
      "MenubarContent",
      "MenubarItem"
    ],
    "overview": "A persistent row of menus (File, Edit, View) for tool-like screens. Supports shortcuts, sub menus, checkbox and radio items.",
    "props": [],
    "usage": {
      "use": [
        "Editors and admin tools with many commands."
      ],
      "avoid": [
        "Website navigation: use Navigation Menu."
      ]
    },
    "content": [],
    "a11y": [
      "role=\"menubar\" with menus and menu items.",
      "Shortcuts are listed but do not replace the items."
    ],
    "keyboard": [
      {
        "key": "← / →",
        "action": "Moves between menus"
      },
      {
        "key": "↓ / Enter",
        "action": "Opens a menu"
      },
      {
        "key": "Esc",
        "action": "Closes it"
      }
    ]
  },
  {
    "slug": "navigation-menu",
    "name": "Navigation menu",
    "category": "Navigation",
    "description": "Top navigation with rich drop-down panels.",
    "exports": [
      "NavigationMenu",
      "NavigationMenuList",
      "NavigationMenuItem",
      "NavigationMenuTrigger",
      "NavigationMenuContent"
    ],
    "overview": "A website header menu. Triggers open panels with featured content and links with descriptions. Plain links sit beside them.",
    "props": [],
    "usage": {
      "use": [
        "Public website headers."
      ],
      "avoid": [
        "App navigation: use the UI shell side nav."
      ]
    },
    "content": [],
    "a11y": [
      "Uses nav and list semantics with aria-expanded triggers.",
      "Panels close on Esc and when focus leaves."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves between items"
      },
      {
        "key": "↓ / Enter",
        "action": "Opens a panel"
      },
      {
        "key": "Esc",
        "action": "Closes it"
      }
    ]
  },
  {
    "slug": "data-table",
    "name": "Data table",
    "category": "Data display",
    "description": "Sortable, filterable, selectable tables of records.",
    "exports": [
      "DataTable",
      "Table",
      "TableContainer",
      "TableToolbar"
    ],
    "overview": "Data tables display records in rows and columns. Add a toolbar for search and actions, sorting for comparison, and selection for batch actions. Pair with Pagination for large data sets.",
    "props": [
      {
        "name": "title",
        "description": "Table title (on TableContainer)."
      },
      {
        "name": "description",
        "description": "Subtitle (on TableContainer)."
      },
      {
        "name": "size",
        "description": "Row height: 24 / 32 / 40 / 48 / 64px."
      },
      {
        "name": "rows",
        "description": "Data rows. Each needs a unique id."
      }
    ],
    "usage": {
      "use": [
        "Records people scan, compare, sort or act on.",
        "Admin and back-office screens."
      ],
      "avoid": [
        "Page layout: use the grid.",
        "One or two attributes per item: use a list or tiles."
      ]
    },
    "content": [
      "Column headers are short nouns.",
      "Right-align numbers in LTR (they flip to the left in RTL)."
    ],
    "a11y": [
      "Renders a real <table> with header cells, so screen readers announce rows and columns.",
      "Batch actions appear when rows are selected; the toolbar announces how many items are selected.",
      "Expand buttons are labelled and expose aria-expanded.",
      "Give every table an accessible name (aria-label or the TableContainer title).",
      "Sortable headers are buttons and announce the sort direction."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves between interactive elements (search, sort buttons, checkboxes)"
      },
      {
        "key": "Enter / Space",
        "action": "Sorts by the focused header or toggles a checkbox"
      }
    ]
  },
  {
    "slug": "structured-list",
    "name": "Structured list",
    "category": "Data display",
    "description": "Simple read-only comparison table.",
    "exports": [
      "Carbon v11",
      "StructuredListWrapper",
      "StructuredListHead",
      "StructuredListBody",
      "StructuredListRow"
    ],
    "overview": "Structured lists compare a small set of items across a few attributes, such as plans. They’re lighter than a data table: no sorting, filtering or pagination.",
    "props": [],
    "usage": {
      "use": [
        "Comparing 2–6 items: plans, packages, specifications."
      ],
      "avoid": [
        "Large or sortable data: use Data table."
      ]
    },
    "content": [],
    "a11y": [
      "Renders with table semantics (role=\"table\"); give it an aria-label."
    ],
    "keyboard": []
  },
  {
    "slug": "contained-list",
    "name": "Contained list",
    "category": "Data display",
    "description": "Titled list of simple items with actions.",
    "exports": [
      "ContainedList",
      "ContainedListItem"
    ],
    "overview": "Contained lists group simple items under a label, such as recent requests in a side panel. Items can be clickable and the list can have an action in its header.",
    "props": [
      {
        "name": "label",
        "description": "List title."
      }
    ],
    "usage": {
      "use": [
        "Short lists in panels: recent items, attachments, team members."
      ],
      "avoid": [
        "Lists with many attributes per item: use Data table or Structured list."
      ]
    },
    "content": [],
    "a11y": [
      "The label titles the list (aria-labelledby).",
      "Clickable items are buttons; give actions accessible labels."
    ],
    "keyboard": []
  },
  {
    "slug": "list",
    "name": "List",
    "category": "Data display",
    "description": "Ordered and unordered text lists.",
    "exports": [
      "UnorderedList",
      "OrderedList",
      "ListItem"
    ],
    "overview": "Lists group related text items. Use ordered lists for steps that happen in sequence and unordered lists for everything else.",
    "props": [],
    "usage": {
      "use": [
        "Steps, requirements, features."
      ],
      "avoid": [
        "Selectable items: use Checkbox or Contained list."
      ]
    },
    "content": [
      "Keep items parallel in grammar; start with a capital letter.",
      "In Arabic, ordered lists use Arabic-Indic or Western digits based on your site’s convention."
    ],
    "a11y": [
      "Native <ol> / <ul>, so item count and nesting are announced."
    ],
    "keyboard": []
  },
  {
    "slug": "tree-view",
    "name": "Tree view",
    "category": "Data display",
    "description": "Expandable hierarchy of folders and items.",
    "exports": [
      "TreeView",
      "TreeNode"
    ],
    "overview": "Tree views show nested hierarchies, like a site map or document folders, that people expand and select.",
    "props": [
      {
        "name": "label",
        "description": "Tree label."
      }
    ],
    "usage": {
      "use": [
        "Hierarchies 3+ levels deep: site maps, folders, categories."
      ],
      "avoid": [
        "Flat lists: use Contained list.",
        "Main site navigation: use Side nav."
      ]
    },
    "content": [],
    "a11y": [
      "Implements the ARIA tree pattern (tree, treeitem, aria-expanded)."
    ],
    "keyboard": [
      {
        "key": "↑ / ↓",
        "action": "Moves between visible nodes Expands / collapses (mirrored in RTL)"
      },
      {
        "key": "Enter / Space",
        "action": "Selects"
      }
    ]
  },
  {
    "slug": "tile",
    "name": "Tile",
    "category": "Data display",
    "description": "Card container: clickable, selectable, expandable, radio.",
    "exports": [
      "Tile",
      "ClickableTile",
      "SelectableTile",
      "ExpandableTile",
      "RadioTile",
      "TileGroup"
    ],
    "overview": "Tiles group related content in a card. Clickable tiles link to a page; selectable and radio tiles act like large checkboxes or radio buttons (e.g. choosing a plan); expandable tiles reveal more detail.",
    "props": [],
    "usage": {
      "use": [
        "Plan or product choices (radio or selectable).",
        "Entry points to sections (clickable).",
        "Summaries with optional detail (expandable)."
      ],
      "avoid": [
        "Nesting interactive elements inside a clickable tile: the whole tile is one link."
      ]
    },
    "content": [],
    "a11y": [
      "Clickable tiles are links; selectable tiles are checkboxes; radio tiles are radio buttons in a fieldset (TileGroup legend).",
      "Keep a heading inside the tile so its purpose is announced."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Opens (clickable), toggles (selectable) or expands (expandable)"
      },
      {
        "key": "↑ / ↓",
        "action": "Moves between radio tiles"
      }
    ]
  },
  {
    "slug": "accordion",
    "name": "Accordion",
    "category": "Data display",
    "description": "Expandable sections for FAQs and long content.",
    "exports": [
      "Accordion",
      "AccordionItem"
    ],
    "overview": "Accordions stack collapsible sections so people can scan headings and open only what they need. Ideal for FAQs and help content.",
    "props": [
      {
        "name": "align",
        "description": "Chevron position."
      },
      {
        "name": "size",
        "description": "Header height."
      }
    ],
    "usage": {
      "use": [
        "FAQs, help articles, optional detail."
      ],
      "avoid": [
        "Content everyone needs to read: show it directly.",
        "Sequential steps."
      ]
    },
    "content": [],
    "a11y": [
      "Headers are buttons with aria-expanded.",
      "Content panels are linked with aria-controls."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Expands or collapses the focused section"
      },
      {
        "key": "Tab",
        "action": "Moves to the next header"
      }
    ]
  },
  {
    "slug": "tag",
    "name": "Tag",
    "category": "Data display",
    "description": "Status labels plus dismissible and selectable tags.",
    "exports": [
      "Tag",
      "DismissibleTag",
      "SelectableTag",
      "OperationalTag"
    ],
    "overview": "Tags label items with a status, category or attribute. Dismissible tags show applied filters; selectable tags work like filter chips; operational tags open more information. Keep color meanings consistent across ScopeSky sites (green = live, red = failed).",
    "props": [
      {
        "name": "children",
        "description": "Tag text (text prop on the interactive tags)."
      },
      {
        "name": "type",
        "description": "Color (read-only, dismissible, operational)."
      },
      {
        "name": "size",
        "description": "Height."
      }
    ],
    "usage": {
      "use": [
        "Read-only: status labels in tables and cards.",
        "Dismissible: applied filters.",
        "Selectable: filter chips people toggle.",
        "Operational: a tag that opens more detail."
      ],
      "avoid": [
        "Actions like Save: use Button.",
        "Long text: tags truncate."
      ]
    },
    "content": [],
    "a11y": [
      "Color is never the only signal: the text carries the meaning.",
      "Interactive tags are buttons; dismissible tags need a labelled close button (title)."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Toggles, dismisses or opens interactive tags"
      }
    ]
  },
  {
    "slug": "code-snippet",
    "name": "Code snippet",
    "category": "Data display",
    "description": "Monospace code with a copy button.",
    "exports": [
      "CodeSnippet"
    ],
    "overview": "Code snippets show commands and code with one-click copy. Single-line for commands, multi- line for blocks (with expand), inline for code inside a sentence.",
    "props": [
      {
        "name": "type",
        "description": "Layout."
      }
    ],
    "usage": {
      "use": [
        "Install commands, API keys, configuration, code samples."
      ],
      "avoid": [
        "Plain values people copy: Copy button is lighter."
      ]
    },
    "content": [],
    "a11y": [
      "The copy button is labelled and announces the feedback.",
      "Multi-line snippets are scrollable regions reachable by keyboard."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Reaches the copy and expand buttons"
      }
    ]
  },
  {
    "slug": "attachment",
    "name": "Attachment",
    "category": "Data display",
    "description": "Shows a file or image with its name, details and upload state.",
    "exports": [
      "Attachment",
      "AttachmentMedia",
      "AttachmentTitle",
      "AttachmentActions"
    ],
    "overview": "Displays an attached file with media, name, metadata and actions. It has idle, uploading, processing, error and done states, in three sizes, horizontal or vertical. Group several in an AttachmentGroup.",
    "props": [],
    "usage": {
      "use": [
        "Files in chat, tickets and upload lists."
      ],
      "avoid": [
        "Large galleries: use a grid of images."
      ]
    },
    "content": [],
    "a11y": [
      "Action buttons need an aria-label that names the file.",
      "Errors are written in the description, not shown by colour alone."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves to the next action"
      },
      {
        "key": "Enter / Space",
        "action": "Runs the focused action"
      }
    ]
  },
  {
    "slug": "avatar",
    "name": "Avatar",
    "category": "Data display",
    "description": "An image or initials that stand for a person or team.",
    "exports": [
      "Avatar",
      "AvatarImage",
      "AvatarFallback",
      "AvatarGroup"
    ],
    "overview": "Shows a profile image, or initials when there is no image. Sizes run from 24 to 48. A status dot can show presence, and AvatarGroup stacks people with a count for the rest.",
    "props": [
      {
        "name": "size",
        "description": "24, 32 or 40 px."
      }
    ],
    "usage": {
      "use": [
        "People in tables, comments, chat and menus."
      ],
      "avoid": [
        "Brand logos: use an image with the logo."
      ]
    },
    "content": [],
    "a11y": [
      "The image alt text is the person’s name.",
      "Presence dots also need text, such as a tooltip."
    ],
    "keyboard": []
  },
  {
    "slug": "carousel",
    "name": "Carousel",
    "category": "Data display",
    "description": "Shows a row of cards one view at a time.",
    "exports": [
      "Carousel",
      "CarouselContent",
      "CarouselItem",
      "CarouselPrevious",
      "CarouselNext"
    ],
    "overview": "A slider built on Embla. Swipe or use the previous and next buttons to move between items. Dots show the position. Works horizontally or vertically and flips in right-to-left.",
    "props": [],
    "usage": {
      "use": [
        "Plans, offers and featured content."
      ],
      "avoid": [
        "Content everyone must see: show it in a list."
      ]
    },
    "content": [],
    "a11y": [
      "role=\"region\" with aria-roledescription=\"carousel\".",
      "Each slide is labelled \"1 of 3\"."
    ],
    "keyboard": [
      {
        "key": "← / →",
        "action": "Moves to the previous or next item"
      },
      {
        "key": "Tab",
        "action": "Moves into the slide content"
      }
    ]
  },
  {
    "slug": "chart",
    "name": "Chart",
    "category": "Data display",
    "description": "Charts built on Recharts, themed with the ScopeSky colours.",
    "exports": [
      "ChartContainer",
      "ChartTooltip",
      "ChartLegend"
    ],
    "overview": "Wraps Recharts with a config that names each series and its colour. Bars, lines, areas and pies share the same tooltip and legend. Series use the Blue scale: Blue 700 first, Blue 300 second.",
    "props": [],
    "usage": {
      "use": [
        "Trends and comparisons on dashboards."
      ],
      "avoid": [
        "A single number: use a KPI card."
      ]
    },
    "content": [],
    "a11y": [
      "Give the chart a title and a text summary.",
      "Offer the numbers as a table too."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Focuses the chart"
      },
      {
        "key": "← / →",
        "action": "Moves the tooltip between points"
      }
    ]
  },
  {
    "slug": "item",
    "name": "Item",
    "category": "Data display",
    "description": "A row with media, a title, a description and actions.",
    "exports": [
      "Item",
      "ItemMedia",
      "ItemContent",
      "ItemTitle",
      "ItemActions"
    ],
    "overview": "A flexible row for lists of devices, people or settings. Three variants (default, outline, muted) and two sizes. The whole row can be a link.",
    "props": [
      {
        "name": "variant",
        "description": "Surface style."
      }
    ],
    "usage": {
      "use": [
        "Devices, team members, settings lists."
      ],
      "avoid": [
        "Tabular data with columns: use a table."
      ]
    },
    "content": [],
    "a11y": [
      "Use a list (ul / li) when items repeat.",
      "Link items have one clear destination."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves to the row or its actions"
      }
    ]
  },
  {
    "slug": "kbd",
    "name": "Kbd",
    "category": "Data display",
    "description": "Shows a keyboard key or shortcut.",
    "exports": [
      "Kbd",
      "KbdGroup"
    ],
    "overview": "Styles keys like Ctrl, Shift and K so shortcuts are easy to scan. KbdGroup joins keys with a plus sign. Works inline in text, in tooltips and in menus.",
    "props": [],
    "usage": {
      "use": [
        "Shortcut hints in menus, tooltips and help."
      ],
      "avoid": [
        "Buttons: Kbd is text, not a control."
      ]
    },
    "content": [],
    "a11y": [
      "Renders <kbd>, which screen readers understand.",
      "Spell out symbols such as arrows in aria-label."
    ],
    "keyboard": []
  },
  {
    "slug": "alert-dialog",
    "name": "Alert dialog",
    "category": "Overlays",
    "description": "Asks to confirm an action that cannot be undone.",
    "exports": [
      "AlertDialog",
      "AlertDialogAction",
      "AlertDialogCancel"
    ],
    "overview": "A modal that interrupts the user and waits for an answer. Focus moves into the dialog and stays there until the user picks an action. Use it for destructive or irreversible steps.",
    "props": [
      {
        "name": "open",
        "description": "Controls whether the dialog is shown."
      },
      {
        "name": "onOpenChange",
        "description": "Called when the dialog opens or closes."
      }
    ],
    "usage": {
      "use": [
        "Deleting records, cancelling a subscription.",
        "Any step the user cannot take back."
      ],
      "avoid": [
        "Routine confirmations: use a toast with Undo.",
        "Forms with many fields: use a Dialog or Sheet."
      ]
    },
    "content": [],
    "a11y": [
      "role=\"alertdialog\" with aria-labelledby and aria-describedby.",
      "Focus starts on Cancel, the safe choice."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves between the actions"
      },
      {
        "key": "Esc",
        "action": "Closes the dialog (same as Cancel)"
      },
      {
        "key": "Enter",
        "action": "Runs the focused action"
      }
    ]
  },
  {
    "slug": "drawer",
    "name": "Drawer",
    "category": "Overlays",
    "description": "A panel that slides up from the bottom of the screen.",
    "exports": [
      "Drawer",
      "DrawerTrigger",
      "DrawerContent",
      "DrawerHeader",
      "DrawerFooter"
    ],
    "overview": "Built on Vaul. On phones it slides up from the bottom and can be dragged closed by its handle. Good for short tasks; on large screens prefer a Dialog or Sheet.",
    "props": [
      {
        "name": "open",
        "description": "Controlled state."
      }
    ],
    "usage": {
      "use": [
        "Short mobile tasks: filters, limits, sharing."
      ],
      "avoid": [
        "Long forms on desktop: use a Sheet."
      ]
    },
    "content": [],
    "a11y": [
      "Focus is trapped while open and returns to the trigger.",
      "The handle is decorative; Esc and the buttons close it."
    ],
    "keyboard": [
      {
        "key": "Esc",
        "action": "Closes the drawer"
      },
      {
        "key": "Tab",
        "action": "Moves through the content"
      }
    ]
  },
  {
    "slug": "hover-card",
    "name": "Hover card",
    "category": "Overlays",
    "description": "A preview card that appears when hovering a link.",
    "exports": [
      "HoverCard",
      "HoverCardTrigger",
      "HoverCardContent"
    ],
    "overview": "Shows a quick preview of a person, account or page behind a link, after a short delay. It is for sighted mouse users only, so the same details must be reachable by following the link.",
    "props": [],
    "usage": {
      "use": [
        "Previews of people, accounts and links."
      ],
      "avoid": [
        "Actions or anything essential."
      ]
    },
    "content": [],
    "a11y": [
      "Content is ignored by screen readers; the link must stand alone.",
      "Opens on focus as well as hover."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Focusing the link opens the card"
      },
      {
        "key": "Esc",
        "action": "Closes it"
      }
    ]
  },
  {
    "slug": "sheet",
    "name": "Sheet",
    "category": "Overlays",
    "description": "A side panel for tasks that keep the page in view.",
    "exports": [
      "Sheet",
      "SheetTrigger",
      "SheetContent",
      "SheetHeader",
      "SheetFooter"
    ],
    "overview": "Slides in from an edge for editing or details without leaving the page. Opens from the end side: the right in English, the left in Arabic.",
    "props": [
      {
        "name": "open",
        "description": "Controlled state."
      }
    ],
    "usage": {
      "use": [
        "Record details, editing, filters on data screens."
      ],
      "avoid": [
        "Confirmations: use an Alert Dialog."
      ]
    },
    "content": [],
    "a11y": [
      "Focus is trapped and returns to the trigger.",
      "The close button has an aria-label."
    ],
    "keyboard": [
      {
        "key": "Esc",
        "action": "Closes the sheet"
      },
      {
        "key": "Tab",
        "action": "Moves through the content"
      }
    ]
  },
  {
    "slug": "aspect-ratio",
    "name": "Aspect ratio",
    "category": "Layout",
    "description": "Keeps media at a fixed width-to-height ratio.",
    "exports": [
      "AspectRatio"
    ],
    "overview": "A wrapper that sizes its child to a ratio such as 16 / 9 or 1 / 1, so images and videos keep their shape while the layout resizes and nothing jumps while they load.",
    "props": [
      {
        "name": "ratio",
        "description": "Width divided by height, for example 16 / 9."
      }
    ],
    "usage": {
      "use": [
        "Hero images, video, product photos and maps."
      ],
      "avoid": [
        "Text content that needs to grow."
      ]
    },
    "content": [],
    "a11y": [
      "The ratio box adds no semantics: give images alt text.",
      "Decorative images use alt=\"\"."
    ],
    "keyboard": []
  },
  {
    "slug": "collapsible",
    "name": "Collapsible",
    "category": "Layout",
    "description": "Shows and hides one section of content.",
    "exports": [
      "Collapsible",
      "CollapsibleTrigger",
      "CollapsibleContent"
    ],
    "overview": "A single expandable area with a trigger. Use it to keep secondary details out of the way until they are needed. For several sections, use Accordion.",
    "props": [],
    "usage": {
      "use": [
        "Order details, advanced filters, extra rows."
      ],
      "avoid": [
        "Several sections in a row: use Accordion."
      ]
    },
    "content": [],
    "a11y": [
      "The trigger has aria-expanded and aria-controls.",
      "Icon-only triggers need an aria-label."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Opens or closes the section"
      }
    ]
  },
  {
    "slug": "resizable",
    "name": "Resizable",
    "category": "Layout",
    "description": "Panels people can resize by dragging a handle.",
    "exports": [
      "ResizablePanelGroup",
      "ResizablePanel",
      "ResizableHandle"
    ],
    "overview": "Splits an area into panels with draggable handles, horizontally or vertically, and nested. Sizes are percentages with optional minimums.",
    "props": [],
    "usage": {
      "use": [
        "Admin tools, editors, map and list layouts."
      ],
      "avoid": [
        "Simple pages: use a fixed layout."
      ]
    },
    "content": [],
    "a11y": [
      "Handles are separators with aria-valuenow.",
      "Keep minimum sizes so content stays readable."
    ],
    "keyboard": [
      {
        "key": "← / →",
        "action": "Moves a focused handle"
      },
      {
        "key": "Home / End",
        "action": "Moves it to the minimum or maximum"
      }
    ]
  },
  {
    "slug": "scroll-area",
    "name": "Scroll area",
    "category": "Layout",
    "description": "A scroll container with a slim, styled scrollbar.",
    "exports": [
      "ScrollArea",
      "ScrollBar"
    ],
    "overview": "Adds a consistent scrollbar to a fixed-height or fixed-width area, vertical or horizontal, while keeping native scrolling.",
    "props": [
      {
        "name": "className",
        "description": "Sets the size, for example h-72."
      }
    ],
    "usage": {
      "use": [
        "Lists inside cards and panels."
      ],
      "avoid": [
        "The whole page: let the page scroll."
      ]
    },
    "content": [],
    "a11y": [
      "Keyboard and wheel scrolling still work.",
      "Focusable content inside must stay reachable."
    ],
    "keyboard": [
      {
        "key": "↑ / ↓",
        "action": "Scrolls when focused"
      },
      {
        "key": "Page Up / Page Down",
        "action": "Scrolls a page"
      }
    ]
  },
  {
    "slug": "separator",
    "name": "Separator",
    "category": "Layout",
    "description": "A thin line between groups of content.",
    "exports": [
      "Separator"
    ],
    "overview": "A 1 px line in Neutral 200 that separates content horizontally or vertically. Purely visual unless it marks a real section break.",
    "props": [
      {
        "name": "orientation",
        "description": "Line direction."
      },
      {
        "name": "decorative",
        "description": "Hides it from assistive tech."
      }
    ],
    "usage": {
      "use": [
        "Between groups in menus, cards and toolbars."
      ],
      "avoid": [
        "Instead of spacing: use space first."
      ]
    },
    "content": [],
    "a11y": [
      "Decorative by default (role=\"none\").",
      "Set decorative={false} for a real section break."
    ],
    "keyboard": []
  },
  {
    "slug": "bubble",
    "name": "Bubble",
    "category": "Conversation",
    "description": "The surface that holds a chat message.",
    "exports": [
      "Bubble",
      "BubbleContent",
      "BubbleReactions",
      "BubbleGroup"
    ],
    "overview": "Displays conversational content in a bubble that sizes to its text, up to 80% of the row. Seven variants, start or end alignment, and an overlapping reactions row. Avatars and names belong to Message.",
    "props": [],
    "usage": {
      "use": [
        "Support chat, comments and AI replies."
      ],
      "avoid": [
        "Long documents: link to them instead."
      ]
    },
    "content": [],
    "a11y": [
      "Bubbles sit inside a log region (role=\"log\").",
      "Reactions are buttons with labels, not bare emoji."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves to interactive content and reactions"
      }
    ]
  },
  {
    "slug": "marker",
    "name": "Marker",
    "category": "Conversation",
    "description": "Inline notes in a thread: status, system events and dividers.",
    "exports": [
      "Marker",
      "MarkerIcon",
      "MarkerContent"
    ],
    "overview": "Marks events between messages, such as an assignment, a status change or a day divider. Three variants: default, border and separator. Pair with a spinner and role=\"status\" for live updates.",
    "props": [
      {
        "name": "variant",
        "description": "Inline row, bottom border or centred divider."
      }
    ],
    "usage": {
      "use": [
        "Ticket timelines, chat history, activity logs."
      ],
      "avoid": [
        "Messages from people: use Message."
      ]
    },
    "content": [],
    "a11y": [
      "Live markers use role=\"status\" so updates are read out.",
      "Icons are decorative."
    ],
    "keyboard": []
  },
  {
    "slug": "message",
    "name": "Message",
    "category": "Conversation",
    "description": "One message in a conversation: avatar, header, bubble and footer.",
    "exports": [
      "Message",
      "MessageAvatar",
      "MessageContent",
      "MessageHeader",
      "MessageFooter"
    ],
    "overview": "Lays out a single message with its avatar, sender, bubble and footer (time, delivery state, actions). Messages from the other side align to the start, yours to the end.",
    "props": [],
    "usage": {
      "use": [
        "Support chat and comment threads."
      ],
      "avoid": [
        "Notifications: use a Toast or Notification."
      ]
    },
    "content": [],
    "a11y": [
      "Each message names its sender for screen readers.",
      "Typing indicators use role=\"status\"."
    ],
    "keyboard": [
      {
        "key": "Tab",
        "action": "Moves to message actions"
      }
    ]
  },
  {
    "slug": "message-scroller",
    "name": "Message scroller",
    "category": "Conversation",
    "description": "The scroll container for a chat transcript.",
    "exports": [
      "MessageScrollerProvider",
      "MessageScroller",
      "MessageScrollerViewport",
      "MessageScrollerItem",
      "MessageScrollerButton"
    ],
    "overview": "Keeps a chat in the right place: opens at the latest message, follows streamed replies, keeps your position when older messages load, and shows a jump-to-latest button when you scroll up.",
    "props": [],
    "usage": {
      "use": [
        "Support chat and AI assistants."
      ],
      "avoid": [
        "Static lists: use a Scroll Area."
      ]
    },
    "content": [],
    "a11y": [
      "Content is role=\"log\" with polite announcements.",
      "The jump button is inert when there is nothing to scroll to."
    ],
    "keyboard": [
      {
        "key": "Page Up / Page Down",
        "action": "Scrolls the transcript"
      },
      {
        "key": "End",
        "action": "Jumps to the latest message"
      }
    ]
  },
  {
    "slug": "trace",
    "name": "Trace",
    "category": "Conversation",
    "description": "Shows the steps an assistant or process took.",
    "exports": [
      "Trace",
      "TraceLine",
      "TraceIcon",
      "TraceTitle",
      "TraceCollapsible"
    ],
    "overview": "A vertical list of steps with icons, titles and details: done, running, error and pending. Steps can expand to show output, sources or diffs.",
    "props": [],
    "usage": {
      "use": [
        "AI assistants, diagnostics, job progress."
      ],
      "avoid": [
        "Final answers: show them as a Message."
      ]
    },
    "content": [],
    "a11y": [
      "Running steps use role=\"status\".",
      "Errors say what failed in words."
    ],
    "keyboard": [
      {
        "key": "Enter / Space",
        "action": "Expands or collapses a step"
      },
      {
        "key": "Tab",
        "action": "Moves between steps"
      }
    ]
  }
];
