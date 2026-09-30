# Justice Hub Mobile App

This folder contains the Expo / React Native mobile version of Maria's Justice Hub.

## Features

- Student-friendly legal-information guidance
- China and Thailand topic matching
- Emergency and support contacts
- Important legal vocabulary and official-source links
- RevenueCat Test Store supporter-purchase demonstration
- Legal, safety, and emergency-help features remain free for every student

## Run locally

1. Install Node.js.
2. Open this `mobile-app` folder in Terminal.
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file containing your own RevenueCat Test Store public SDK key:

```text
EXPO_PUBLIC_REVENUECAT_TEST_API_KEY=YOUR_TEST_STORE_PUBLIC_SDK_KEY
```

5. Start the mobile app:

```bash
npx expo start --dev-client
```

## RevenueCat testing

The project uses RevenueCat Test Store for a no-real-money supporter-demo purchase. Test Store purchases do not charge money and do not restrict any legal, safety, or emergency-support feature.

## Important

This is a legal-information prototype, not legal advice or an emergency service.
