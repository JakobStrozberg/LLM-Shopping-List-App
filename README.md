# No Name Shopping List

A collaborative family shopping list app that helps families shop together, share lists, and earn rewards for purchasing No Name brand products.

<img width="198" alt="Screenshot 2025-06-28 at 12 56 22 PM" src="https://github.com/user-attachments/assets/08a8261b-9259-4b24-a2b3-2343cd793d60" />
## Features

- 👨‍👩‍👧‍👦 **Family Sharing**: Create and share shopping lists with up to 5 family members
- 🤖 **Smart Suggestions**: AI-powered product recommendations based on your current list
- 🏆 **Rewards System**: Earn points for No Name products and unlock family rewards
- 📱 **Cross-Platform**: Web app with React Native mobile companion
- 💬 **Collaboration**: Add comments and reactions to shared items
- 🏪 **Store Organization**: Items automatically categorized by store sections

## Screenshots

<img width="465" alt="Screenshot 2025-06-28 at 10 41 40 AM" src="https://github.com/user-attachments/assets/40f5e210-f770-4b75-9cb8-a47b88e04579" />
<img width="466" alt="Screenshot 2025-06-28 at 12 56 34 PM" src="https://github.com/user-attachments/assets/08973df6-eac0-4efb-b512-00facc1bcff4" />
<img width="493" alt="Screenshot 2025-06-28 at 10 42 37 AM" src="https://github.com/user-attachments/assets/5f5da67f-bf94-4edf-a001-83e01c3005af" />
<img width="466" alt="Screenshot 2025-06-28 at 10 42 10 AM" src="https://github.com/user-attachments/assets/9e729f78-92db-4c37-ac76-4cb4ff1c912d" />


## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- For mobile development: Expo CLI

### Environment Setup

1. Clone the repository
```bash
git clone <repository-url>
cd noname-shopping-list
```

2. Install dependencies
```bash
cd noname-shopping-list
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
# Optional: OpenAI API Key for enhanced smart suggestions
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Optional: Firebase config for future authentication features
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
# ... other Firebase config
```

**Note:** The app works without API keys - it will fall back to local functionality.

### Running the Application

#### Web App
```bash
cd noname-shopping-list
npm start
```

#### Mobile App (Expo)
```bash
cd NoNameiOS
npm start
```

## Project Structure

```
noname-shopping-list/          # Main React web application
├── src/
│   ├── components/           # Reusable UI components
│   ├── screens/             # App screens (Auth, Shopping, Family, Chat)
│   ├── store/               # Zustand state management
│   ├── services/            # API services (OpenAI, categorization)
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
└── .env.example            # Environment variables template

NoNameiOS/                   # React Native mobile app
├── App.tsx                 # Mobile app entry point
├── ios/                    # iOS-specific files
└── android/                # Android-specific files
```

## API Keys and Security

This repository is configured to safely exclude all sensitive information:

- ✅ All `.env*` files are gitignored
- ✅ API keys and secrets are excluded
- ✅ Firebase configuration files are ignored
- ✅ Mobile app certificates and keys are excluded

### Required API Keys (Optional)

1. **OpenAI API Key**: For enhanced smart suggestions and automatic categorization
   - Sign up at [OpenAI](https://openai.com/api/)
   - Add to `REACT_APP_OPENAI_API_KEY` in `.env`

2. **Firebase** (for future features): 
   - Create project at [Firebase Console](https://console.firebase.google.com/)
   - Add configuration to `.env`

## Development

### Technologies Used

- **Frontend**: React, TypeScript, CSS3
- **Mobile**: React Native, Expo
- **State Management**: Zustand
- **Icons**: Lucide React
- **AI Services**: OpenAI GPT-3.5
- **Build Tool**: Create React App

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
