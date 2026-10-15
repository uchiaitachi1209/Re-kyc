# Sirsa RE-KYC HTML form

Open `index.html` in a browser, enter details, then choose **Review printable form**. The preview has **Edit details** and **Print both pages** controls. Print at **100% scale** on **Letter** paper with background graphics enabled for the pale green section bars.

The printable form has two HTML pages matching the two pages of the supplied PDF. Customer signatures, thumb impression, and bank signatures remain blank for handwritten completion. Each change is saved in browser `localStorage` so **Edit details** reloads the draft, including after closing and reopening the tab. **Clear all details** resets the form and removes the draft. If persistent storage is unavailable, the app falls back to tab `sessionStorage`. No form data is sent to a server.

Files:
- `index.html` — detail entry page
- `form.html` — two-page form preview
- `style.css` — screen and print styles
- `script.js` — form generation and transfer
