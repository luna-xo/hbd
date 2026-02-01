# Birthday Website 🎂

A cute + aesthetic birthday page (clean, modern vibe) built as a simple static site.

## Run locally

### Option 1: Just open the file

Double-click `index.html`.

### Option 2: Local server (recommended)

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

## Customize

Open `index.html` and edit:

- Name / age / note text
- Sections: Childhood, Likes, Memory lane, Our couple pics
- The PNG inside the “Birthday Pass” card (`image.png`)

### Quick customization via URL

You can set name/age/from with query params:

- `?name=Rohan&age=19&from=Sri`

## Add your images & videos

Create folders:

- `assets/images/`
- `assets/videos/`

Then in `index.html`, replace placeholders like:

- `<div class="media ..."></div>` → `<img class="mediaReal" src="./assets/images/photo-1.jpg" alt="..." />`
- `<div class="media ..."></div>` → `<video class="mediaReal" controls playsinline src="./assets/videos/clip-1.mp4"></video>`

## Timeline (young → today)

Click the ⏳ **Timeline** chip in the top bar to open `timeline.html` in a new tab.

- Desktop: scroll **sideways** (horizontal snap)
- Mobile: scroll **down** (vertical snap)
- Use the “Axis” button on the timeline page to force vertical mode anytime

To swap in real timeline photos, open `timeline.html` and replace a placeholder like:

- `<div class="frame__media ph1" role="img"></div>`

With:

- `<img class="frame__img" src="./assets/images/age-03.jpg" alt="Age 3" />`

## Deploy

This is a static site—drop these files into any static host (GitHub Pages, Netlify, Vercel, etc.).

# hbd
# hbd
# hbd
# hbd
