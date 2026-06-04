---
name: Multi-page store sync
description: How the multi-page data model works in the editor store
---

`data.pages[]` is the canonical source for all pages. `data.elements`, `data.rootIds`, `data.scripts`, `data.globalScripts` are always the **live view** of the current page.

**How to apply:**
- `switchPage(id)` calls `syncCurrentPageIn(state)` (saves live → pages[]) then `loadPage(state, newPage)` (loads pages[] → live)
- `getData()` returns a snapshot with the current page synced into `pages[]` — used for autosave
- `parseProjectData` (utils.ts) migrates old projects without `pages` to the new format, creating a single "Главная" page

**Why:**
All existing code reads `data.elements`/`data.rootIds` without change. Multi-page is a layer on top that swaps these arrays when switching pages. This avoids rewriting all canvas/element components.
