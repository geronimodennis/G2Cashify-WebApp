# G2Cashify

Cloudflare production: https://g2cashify.com

The Cloudflare fallback URL remains available at https://g2cashify.geronimodennis.workers.dev.

Run `npm ci`, sign in with `npx wrangler login`, then run `npm run deploy` to publish the `dist` assets to Cloudflare. Deployment is manual; GitHub pushes do not automatically publish this Cloudflare site.

Responsive, dependency-free business PWA. Run `npm start` to preview at http://127.0.0.1:4173. Run `npm run check` for JavaScript syntax validation.

The quote form validates device/contact information, previews up to four images, copies the prepared message, and opens https://www.messenger.com/t/1344503038740125. The customer pastes the message, attaches photos, and manually sends it. Clipboard failures have a selectable text fallback; a direct chat link handles blocked popups. A device share option passes text and selected photos to the native share menu when supported; customers must select Messenger and G2Cashify and verify the content before sending. Messenger cannot be prefilled directly by this website. No send API is used and no personal data is placed in URLs or persisted automatically. A downloadable summary remains available. Service area and hours still need confirmation.

PWA installation requires HTTPS (or localhost) and browser support. The site shell and offline fallback are cached after the first successful online visit. Font loading is optional; local font fallbacks work offline.
