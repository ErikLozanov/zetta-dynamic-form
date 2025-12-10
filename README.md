# Zetta Form Builder

Hi! This is my submission for the React assignment.

I used **React Hook Form** for the state management and **Material UI** to keep it looking clean.

## Features
- **JSON to Form:** You paste JSON on the left, and the form updates instantly on the right.
- **Nested Groups:** It handles deep nesting recursively, so you can have groups inside groups.
- **Conditional Logic:** Try selecting "Manager" in the demo below—new fields will appear.
- **Mock API:** If you type `90210` into the Zip Code field, it simulates an API call to autofill the City and State.
- **Auto-Save:** I added a debounce function that saves your progress to localStorage. If you refresh, your data is still there.
- **Validation:** Standard stuff like required fields, patterns, etc., are all supported.

## How to Run It
Standard Vite setup here. Just clone the repo and run:

npm install
npm run dev


## How to Run Test

npm test

## JSON Tests

### 1. Basic Inputs & Validation
**Goal:** Verify all input types render and `required` validation works.
- **Action:** Paste the JSON below. Click "Submit" without filling fields to see errors.
```json
{
  "formTitle": "Basic Inputs & Validation Test",
  "fields": [
    {
      "id": "fullName",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "validation": [{ "type": "required", "message": "Name is required" }]
    },
    {
      "id": "contactMethod",
      "type": "radio",
      "label": "Preferred Contact Method",
      "options": [
        { "label": "Email", "value": "email" },
        { "label": "Phone", "value": "phone" }
      ]
    },
    {
      "id": "terms",
      "type": "checkbox",
      "label": "I agree to the Terms & Conditions",
      "validation": [{ "type": "required", "message": "You must agree to continue" }]
    }
  ]
}
```


### 2. Dynamic Visibility (Conditional Logic)
**Goal:** Verify fields show/hide based on dependencies.
- **Action:** Select "Car" to see the Trunk field. Switch to "Truck" to see the Payload field.
```json

{
  "formTitle": "Dynamic Visibility Test",
  "fields": [
    {
      "id": "vehicleType",
      "type": "dropdown",
      "label": "Select Vehicle Type",
      "options": [
        { "label": "Car", "value": "car" },
        { "label": "Truck", "value": "truck" }
      ]
    },
    {
      "id": "trunkSpace",
      "type": "text",
      "label": "Trunk Capacity (Liters)",
      "visibleWhen": [{ "fieldId": "vehicleType", "equals": "car" }]
    },
    {
      "id": "payloadCapacity",
      "type": "text",
      "label": "Payload Capacity (Tons)",
      "visibleWhen": [{ "fieldId": "vehicleType", "equals": "truck" }]
    }
  ]
}
```


### 3. API Integration (Auto-Fill)
**Goal:** Verify the mock API works.
- **Action:** Type 90210 into the Zip Code field. Wait ~1.5 seconds for City/State to auto-fill.

```json
{
  "formTitle": "API Auto-Fill Test",
  "fields": [
    {
      "id": "zipCode",
      "type": "text",
      "label": "Zip Code (Try 90210)",
      "validation": [{ "type": "minLength", "value": 5, "message": "5 digits required" }]
    },
    { "id": "city", "type": "text", "label": "City (Auto-filled)" },
    { "id": "state", "type": "text", "label": "State (Auto-filled)" }
  ],
  "autoFill": [
    {
      "triggerFieldId": "zipCode",
      "method": "getByZip",
      "mapping": { "city": "city", "state": "state" }
    }
  ]
}
```


### 4. Recursive Nesting
**Goal:** Verify groups can be nested inside other groups.
```json
{
  "formTitle": "Deep Nesting Test",
  "fields": [
    {
      "id": "level1",
      "type": "group",
      "title": "Level 1",
      "children": [
        {
          "id": "level2",
          "type": "group",
          "title": "Level 2",
          "children": [
             { "id": "deepField", "type": "text", "label": "I am deep inside!" }
          ]
        }
      ]
    }
  ]
}
```
