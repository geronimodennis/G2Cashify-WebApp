# G2Cashify

Cloudflare production: https://g2cashify.com

The Cloudflare fallback URL remains available at https://g2cashify.geronimodennis.workers.dev.

Run `npm ci`, sign in with `npx wrangler login`, then run `npm run deploy` to publish the `dist` assets to Cloudflare.

## Deploy from a GitHub release

The `Deploy release to Cloudflare` GitHub Actions workflow deploys the exact released tag to the existing `g2cashify` Worker when a release is published. Ordinary commits and tag pushes do not trigger a deployment. You can also run the workflow manually from Actions using a selected branch or tag.

One-time setup: create a Cloudflare API token using the **Edit Cloudflare Workers** template, restricted to the G2Cashify Cloudflare account and the `g2cashify.com` zone. Add it as the **CLOUDFLARE_API_TOKEN** GitHub repository Actions secret. Do not put the token in source files or release notes. The workflow reports a clear authorization error if the secret is missing; add the secret and re-run the failed job. The account ID is already configured in the workflow.

The workflow installs locked dependencies, validates JavaScript and Messenger behavior, deploys, and checks the production homepage. Check its green status in Actions to confirm a release was deployed; publishing a release alone does not guarantee successful deployment.

Responsive, dependency-free business PWA. Run `npm start` to preview at http://127.0.0.1:4173. Run `npm run check` for JavaScript syntax validation.

The quote form validates device/contact information, previews up to four images, copies the prepared message, and opens https://www.messenger.com/t/1344503038740125. The customer pastes the message, attaches photos, and manually sends it. Clipboard failures have a selectable text fallback; a direct chat link handles blocked popups. A device share option passes text and selected photos to the native share menu when supported; customers must select Messenger and G2Cashify and verify the content before sending. Messenger cannot be prefilled directly by this website. No send API is used and no personal data is placed in URLs or persisted automatically. A downloadable summary remains available. Service area and hours still need confirmation.

PWA installation requires HTTPS (or localhost) and browser support. The site shell and offline fallback are cached after the first successful online visit. Font loading is optional; local font fallbacks work offline.
