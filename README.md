# Portable Console

A lightweight, embeddable console tool for debugging JavaScript when DevTools are not accessible.

## Features

- Floating console interface with a toggle button
- Supports standard console methods (log, warn, error)
- JavaScript expression evaluation
- Syntax highlighting for objects and code
- Error handling for uncaught exceptions and promise rejections
- Dark theme with clean UI using Franken UI and TailwindCSS

## Installation
Add the following script to your HTML page:
```html
<script src="https://url.shuchir.dev/portable-console.js"></script>
```

## Usage
Once installed, the console automatically hooks into native console functions. No additional configuration needed:

```javascript
console.log('Hello, world!');
console.warn('This is a warning');
console.error('This is an error');
```

Access the console by clicking the bug icon in the bottom-right corner of the page.

## Why Use Portable Console?
This tool is designed for scenarios where browser DevTools are not accessible, such as:

- iPad or tablet devices
- Locked-down environments
    - Chromebooks with restricted access
- Quick debugging sessions without opening DevTools

## Technical Details
- Built with vanilla JavaScript
- Uses IonIcons for icons
- Syntax highlighting via highlight.js
- Styling with TailwindCSS and Franken UI
- Sandboxed iframe implementation for script communication

## Future Plans
- Elements tab for DOM inspection
- Network request monitoring
- Additional debugging features