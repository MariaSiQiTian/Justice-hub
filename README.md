# Maria's Justice Hub

> **Know your rights. Know where to start.**

Maria's Justice Hub is a student-designed legal-information prototype. It helps a user describe a problem, choose China or Thailand, and receive clear, cautious guidance with possible legal topics, practical next steps, key support contacts, and links to official sources.

## Live prototype

- Website: https://marias-justice-hub.zl137468.chatgpt.site/
- Mobile prototype: https://snack.expo.dev/@mariaaaaaaaaaaa/justice-hub

## Demo video

Watch the walkthrough: [`demo/justice-hub-walkthrough.mov`](demo/justice-hub-walkthrough.mov)

## What the website demonstrates

- Question-to-guidance flow with situation-based demo responses
- China and Thailand locations
- Legal-information cards with source links and plain-language vocabulary
- Safety-focused information for concerns such as unwanted touching, bullying, domestic violence, workplace issues, and online privacy
- Country-specific emergency and support contacts
- English, Chinese, and Thai interface options

## Important note

This is a **demo / prototype**. It provides general legal information, not legal advice. It is not a substitute for a qualified lawyer, emergency services, or a local support organisation.

## Project structure

```text
.
├── index.html                         # Website layout and styles
├── js/
│   └── justice-hub-logic.js           # Question matching and demo guidance
├── demo/
│   └── justice-hub-walkthrough.mov    # Short walkthrough video
├── sources/
│   └── china/
│       └── Labour_Contract_Law_China.xlsx
└── README.md
```

## Run the website locally

Because this is a static website, open `index.html` in a browser. For the best experience, publish this folder with GitHub Pages or another static-site host.

## Future development

- Add a secure backend for any real AI functionality
- Search verified legal-source documents before generating explanations
- Add reviewed city-specific organisations and lawyers
- Expand the verified legal-source library
- Add a stronger multilingual legal-content review process

## Credits

Designed by Maria. Built as a student competition prototype with React Native / Expo for the mobile prototype and a static web prototype. Codex was used as an AI coding assistant during development and debugging.
