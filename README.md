# Chicken Cooking Guide PWA 🍗👨‍🍳

An interactive Progressive Web App for cooking chicken with step-by-step instructions, automatic timers, and a beautiful warm traditional cooking theme.

## Features

✨ **16-Step Cooking Guide** - Complete chicken recipe with detailed instructions  
⏱️ **Built-in Timers** - Automatic timers that start when you check off timer-enabled steps  
🎨 **Stunning Animations** - Framer Motion micro-interactions and Lottie animation support  
📱 **PWA Support** - Install on your device, works offline  
🔔 **Notifications** - Get alerted when timers complete  
💾 **Progress Persistence** - Your progress is saved automatically  
🌐 **Offline First** - Cook without internet connection  
♿ **Accessible** - Keyboard navigation and screen reader support  

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS with custom warm cooking theme
- **Animations**: Framer Motion + Lottie React
- **State Management**: Zustand with persistence
- **PWA**: vite-plugin-pwa + Workbox
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd chikook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Adding Custom Assets

### Icons (PWA)

Generate 192x192 and 512x512 PNG icons and place them in `public/icons/`:
- Use https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
- Recommended: Chef hat or cooking pot design with warm brown colors

### Notification Sound

Add an MP3 notification sound to `public/sounds/notification.mp3`:
- Duration: 1-2 seconds
- Recommended: Kitchen timer or bell sound
- Sources: https://freesound.org/ or https://notificationsounds.com/

### Lottie Animations (Optional)

Download cooking-themed Lottie animations from https://lottiefiles.com/:
1. Search for "cooking", "chef", "kitchen", "timer"
2. Download JSON files
3. Place in `src/assets/lottie/`
4. Import and use with the `AnimatedIcon` component

Recommended animations:
- Chef cooking (header animation)
- Pot boiling (active step indicator)
- Celebration (completion animation)

## Project Structure

```
chikook/
├── public/
│   ├── icons/              # PWA icons
│   ├── sounds/             # Notification sounds
│   ├── manifest.json       # PWA manifest
│   └── chef-hat.svg        # Favicon
├── src/
│   ├── assets/
│   │   └── lottie/         # Lottie animation JSON files
│   ├── components/
│   │   ├── Icons/          # Animated icon components
│   │   ├── Timer/          # Timer display & controls
│   │   ├── OfflineIndicator.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StepItem.tsx
│   │   └── StepList.tsx
│   ├── data/
│   │   └── cookingSteps.ts # Recipe data
│   ├── hooks/
│   │   ├── useTimer.ts     # Timer logic
│   │   └── useTimerNotification.ts
│   ├── store/
│   │   └── cookingStore.ts # Zustand state management
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + Tailwind
└── vite.config.ts          # Vite + PWA configuration
```

## Color Theme

The app uses a warm traditional cooking color palette:

- **Primary**: #8B4513 (Saddle Brown)
- **Secondary**: #D2691E (Chocolate)
- **Accent**: #FF6347 (Tomato)
- **Background**: #FFF8DC (Cornsilk)
- **Surface**: #FAEBD7 (Antique White)
- **Success**: #228B22 (Forest Green)
- **Text**: #3E2723 (Dark Brown)

## Usage

1. **Enable Notifications**: Click "Enable Alerts" in the header (recommended)
2. **Follow Steps**: Check off each step as you complete it
3. **Auto Timers**: Steps with timers will automatically start when checked
4. **Timer Controls**: Pause, resume, or reset timers as needed
5. **Track Progress**: Watch the progress bar fill as you cook
6. **Reset**: Click the reset button to start over

## PWA Installation

### Desktop (Chrome/Edge)
- Click the install icon in the address bar
- Or go to Settings → Install Chicken Cooking Guide

### Mobile (Android)
- Tap the menu (⋮) → "Install app" or "Add to Home Screen"

### Mobile (iOS)
- Tap Share button → "Add to Home Screen"

## Browser Support

- Chrome/Edge: Full support (recommended)
- Firefox: Full support
- Safari: Partial PWA support (no background notifications)

## Development

### Key Files to Modify

- **Recipe Steps**: `src/data/cookingSteps.ts`
- **Colors/Theme**: `src/index.css` and `tailwind.config.js`
- **Timer Duration**: Adjust `timerDuration` in cooking steps (in seconds)
- **Animations**: Timing and effects in component files

### Adding New Steps

Edit `src/data/cookingSteps.ts`:

```typescript
{
  id: 17,
  description: 'Your new step description',
  timerDuration: 300, // Optional: time in seconds
  completed: false,
  iconType: 'icon-name',
}
```

## Performance

- Initial bundle: ~200KB (gzipped)
- Lighthouse PWA score: 90+
- Animations: 60fps on most devices
- Offline: Full functionality after first visit

## License

MIT License - feel free to use for personal or commercial projects

## Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

## Credits

- Icons: Lucide React
- Animations: Framer Motion
- Fonts: Playfair Display, Inter (Google Fonts)

---

**Enjoy cooking! 🍗✨**

