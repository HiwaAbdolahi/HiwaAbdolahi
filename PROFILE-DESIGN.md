# Behind the profile

This profile is a small visual system built with GitHub Markdown and repository-owned SVG artwork. The reading order moves from role and location to project evidence, technical detail, education and contact.

## Visual language

Midnight teal, warm ivory and mint create a consistent palette across the sculptural header, project illustrations, code inventory and education journey. Project illustrations use motion related to their subject. The data graphic remains still so its values are easy to read.

The README uses semantic headings, ordinary links, descriptive alternative text and expandable technical details. Desktop and narrow-screen SVG variants are selected through picture elements. These are images, not embedded applications; GitHub controls their rendering. CSS animation support can vary between viewers.

## Reproduce the data graphics

From the repository root, with Node.js installed:

```sh
node scripts/build-profile.mjs
```

The script reads the checked-in snapshot and generates the desktop/mobile code inventory and SmartEnergy message-flow illustration. It needs no API key or third-party image-statistics service.

## Source inventory methodology

The snapshot dated 2026-09-17 enumerates files from four public repository trees. Exact tree SHAs, repository totals and every included file path are recorded in [the JSON inventory](./data/profile-code-snapshot.json).

Counted extensions: .cs (C#), .cshtml (Razor), .js (JavaScript), .css (CSS), .html (HTML). The exclusion expression is:

```text
(^|/)(bin|obj|node_modules|lib|vendor|vendors|migrations|Areas)(/|$)|\.min\.|\.Designer\.cs$|ModelSnapshot\.cs$
```

Matching is case-insensitive. Excluding Areas removes Identity scaffold folders, but other templates may remain. These are repository file counts, not authored code, lines of code, GitHub's byte-based language shares, skill ratings or a measure of engineering quality. The bachelor project includes work from a four-person team. Percentages are rounded independently.

The inventory is a snapshot, not automatically refreshed activity. Re-running the generator redraws the same snapshot; refreshing the data requires retrieving and classifying new repository trees, then recording their SHAs and date.

## SmartEnergy illustration

The control rule is based on workerC/Worker.cs in SmartEnergy: a temperature below 21.0 produces an ON command, otherwise OFF. The illustrated 20.5°C is an example, not a sensor reading. Arrows show message delivery and the return command; motion is illustrative, not a timing or performance claim.

The deployment path is grounded in the repository's GitHub Actions workflow. No uptime, latency or scale claims are inferred.

## Maintaining the profile

Keep degree status, contact details and role preferences current. Update project descriptions when behavior changes. Preserve alternative text and readable source links. Review live demo availability separately from repository availability.
