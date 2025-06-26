# NoName Shopping List

A social shopping list app for Loblaws Digital's hackathon that makes grocery shopping a family activity!

## Features

- 🛒 **Shared Shopping Lists**: Real-time collaborative lists with family members
- 💬 **Family Chat**: Discuss shopping needs with your family
- 👨‍👩‍👧‍👦 **Family Groups**: Create or join families (up to 5 members)
- ❤️ **Item Likes**: Family members can like items on the list
- 💰 **Rewards Tracker**: Track NoName points earned as a family
- 🎨 **NoName/PC Branding**: Clean yellow & black design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Quick Demo

To quickly test the app:
1. Sign up with any email/name or use "Sign in with Apple"
2. Choose an avatar
3. Click "Quick Demo (Join The Smiths)" to join a pre-populated family
4. Explore the shopping list, chat, and family features!

## Simulated Features

The app includes mock data to simulate:
- Other family members adding items to the list
- Family members responding in chat
- Real-time updates to shopping items
- Family loyalty points

## Tech Stack

- React with TypeScript
- React Router for navigation
- Zustand for state management
- Lucide React for icons
- Local storage for data persistence

## For iOS Integration

This web app is designed to be embedded in a React Native WebView for the iOS app.

## Setting up the Item Categorization Feature

The shopping list now includes an AI-powered feature to automatically categorize items by store sections (dairy, produce, etc.) for a better shopping experience.

### Configuration

1. Create a `.env` file in the root of the `noname-shopping-list` directory:

```bash
touch .env
```

2. Add your OpenAI API key to the `.env` file:

```
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

3. Restart the development server for the changes to take effect.

### How it works

- When you add items to your shopping list, they will automatically be categorized using OpenAI's GPT-3.5
- If no API key is provided, the app will fall back to a pattern-based categorization system
- Toggle between categorized view and regular list view using the grid/list button in the header
- Categories include: Produce, Dairy, Meat & Seafood, Bakery, Frozen, Pantry & Dry Goods, Snacks & Candy, Beverages, Health & Beauty, Household, Baby, Pet, and Other
