# Wedding website

A single-page wedding site: plain HTML, CSS and JS, no build step.

## Files
- `index.html`: all the content (names, date, venue, schedule, dress code, RSVP)
- `styles.css`: colours and fonts are set at the top in `:root`
- `script.js`: RSVP form handling and scroll animations

## Things to personalise
- **Names, date, time, venue**: edit the text in `index.html` (search for "Jenny", "Raymond", "2027", "UBC Boathouse", "TIME TO COME").
- **Link preview**: `images/share.jpg` (1200×630) is the picture shown when the link is shared in iMessage, WhatsApp etc.; the `og:` tags in `index.html` set its title and text. Messaging apps cache previews, so a changed image can take a while to show.
- **Map link**: replace the `Open map` button's `href` with your venue's Google or Apple Maps link.
- **Save-the-date stage**: the Schedule and RSVP sections are hidden (each has `hidden` and a comment above it),
  and one "More details to come!" note (`#more-soon`) stands in for them.
  To bring a section back exactly as it was, remove its `hidden`. Delete the `#more-soon` section once everything is back.
- **Countdown**: shows whole days until July 16, 2027. The date is set in `script.js` (`new Date(2027, 6, 16)`; months count from 0).
- **Proposal photos**: the "She said Yes!" section shows `images/photos/proposal-1.webp` and `proposal-2.webp`
  (portrait, 720×900) as two big overlapping polaroids; stacked on phones.
- **Other photos**: square WebP images (600×600) in `images/photos/`, shown as polaroids. On screens 1000px and wider they sit in the
  side margins (odd ones left, even ones right; `--y` on each `<figure>` is how far down, measured from Date & Place to the end). On phones they're a
  swipeable strip under "Our Moments". To add one, copy a `<figure>` block. Strip location data from phone photos first (re-saving with Python/PIL without `exif=` does this).
- **Schedule**: currently shows "Coming soon". When it's final, fill in the four `tl-row` items, remove `hidden` from `<ol class="timeline">`, and delete the `coming-soon` block above it.
- **Dress code**: currently shows "Coming soon". When it's ready, change the `--c:` colours on the swatches, remove `hidden` from the palette list and the "Look good" note, and delete the `coming-soon` block in that section.
- **Illustrations**: the line-art doodles are inline SVGs. To use your own artwork, swap an `<svg>` for
  `<img src="images/your-file.png" alt="...">`. Transparent PNGs drawn in black ink suit this style best.

## Collecting RSVPs
**RSVPs are hidden for the save-the-date stage.** The section shows "Invitation to follow!" instead.
To open them, delete the `coming-soon` block in the RSVP section of `index.html` and remove
`hidden` from `<form ... id="rsvp-form">`.

Right now the form only shows a thank-you message; responses aren't saved anywhere.
To collect them, make a free form at https://formspree.io, then paste its URL into
`RSVP_ENDPOINT` at the top of `script.js`. Responses will arrive by email.

## Preview locally
```bash
python3 -m http.server 8123
```
Then open http://localhost:8123

## Publishing
Upload the folder to any static host, such as Netlify Drop, GitHub Pages, Vercel or Cloudflare Pages.

## Save the date cards
The card drafts are kept on the **`save-the-date` branch**, not here, so they never get published with the site.
**Latest candidate: C3.2r** (4×6 print), `save-the-date/png/latest-candidate.png` on that branch.
To work on the cards: `git switch save-the-date` (and `git merge main` first if the illustration changed).
