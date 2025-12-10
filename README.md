# Zetta Form Builder

Hi! This is my submission for the React assignment. I built a dynamic form generator that takes a JSON config and renders a fully functional React form—no hardcoded inputs involved.

I used **React Hook Form** for the state management and **Material UI** to keep it looking clean.

## Features
- **JSON to Form:** You paste JSON on the left, and the form updates instantly on the right.
- **Nested Groups:** It handles deep nesting recursively, so you can have groups inside groups.
- **Conditional Logic:** Try selecting "Manager" in the demo below—new fields will appear.
- **Mock API:** If you type `90210` into the Zip Code field, it simulates an API call to autofill the City and State.
- **Auto-Save:** I added a debounce function that saves your progress to localStorage. If you refresh, your data is still there.
- **Validation:** Standard stuff like required fields, patterns, etc., are all supported.

## 🚀 How to Run It
Standard Vite setup here. Just clone the repo and run:

npm install
npm run dev


## 🚀 How to Run Test

npm test
