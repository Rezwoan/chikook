# Adding a Notification Sound 🔔

## Quick Method (5 minutes)

### Option 1: Free Sound Libraries (Recommended)

#### Freesound.org
1. Go to: https://freesound.org/
2. Search: "kitchen timer" or "bell" or "notification"
3. Filter by: Creative Commons license
4. Preview and download your favorite
5. Convert to MP3 if needed (see below)
6. Save as `public/sounds/notification.mp3`

#### Recommended searches:
- "kitchen timer"
- "bell ding"
- "gentle notification"
- "cooking timer"
- "soft chime"

#### NotificationSounds.com
1. Go to: https://notificationsounds.com/
2. Browse notification sounds
3. Download MP3 directly
4. Save to `public/sounds/notification.mp3`

#### Mixkit
1. Go to: https://mixkit.co/free-sound-effects/notification/
2. Browse free notification sounds
3. Download MP3
4. Save to `public/sounds/notification.mp3`

### Option 2: Create Your Own

#### Using Audacity (Free)
1. Download: https://www.audacityteam.org/
2. Generate → Tone
3. Settings:
   - Waveform: Sine
   - Frequency: 800 Hz (or 1000 Hz)
   - Duration: 1 second
4. Effects → Fade Out (last 0.3 seconds)
5. Export → MP3
6. Save to `public/sounds/`

#### Using Online Tone Generator
1. Go to: https://onlinetonegenerator.com/
2. Set frequency: 800-1000 Hz
3. Click Play and record with your OS
4. Or use: https://www.zapsplat.com/ (free sound effects)

### Option 3: Extract from YouTube
1. Find a kitchen timer sound video
2. Use: https://ytmp3.cc/ to download audio
3. Trim to 1-2 seconds using online editor
4. Save as `public/sounds/notification.mp3`

## Sound Specifications

### Format
- **Format**: MP3 (most compatible)
- **Bitrate**: 128 kbps (good quality, small size)
- **Sample rate**: 44.1 kHz or 48 kHz
- **Channels**: Mono or Stereo

### Duration
- **Recommended**: 1-2 seconds
- ❌ Too short (<0.5s): May not grab attention
- ❌ Too long (>3s): Annoying and interrupts

### Volume
- **Moderate volume** - Not too loud or soft
- Test on different devices
- Should be noticeable but not jarring

### Characteristics
✅ Pleasant, not annoying  
✅ Clear and distinct  
✅ Fits cooking/kitchen theme  
✅ Not too high-pitched  
❌ Avoid harsh or jarring sounds  
❌ Avoid very quiet sounds  
❌ Avoid copyrighted music  

## Sound Ideas

### Kitchen-Themed Sounds
1. 🔔 **Kitchen timer bell** - Classic choice
2. 🥄 **Spoon tapping on pot** - Playful
3. 🍳 **Gentle sizzle** - Cooking related
4. 🔥 **Soft whoosh** - Fire/heat related
5. ✨ **Gentle chime** - Pleasant notification

### General Notification Sounds
1. 🔔 **Single bell ding** - Simple and effective
2. 🎵 **Soft marimba note** - Pleasant
3. 📱 **iOS-style notification** - Familiar
4. 🔊 **Gentle ping** - Subtle

## Testing Your Sound

### 1. Test Volume
- Play on phone speaker
- Play on computer
- Adjust volume if needed

### 2. Test in Context
1. Add sound file to `public/sounds/notification.mp3`
2. Restart dev server
3. Complete a timed cooking step
4. Wait for timer to complete
5. Sound should play automatically

### 3. Test Browser Compatibility
- Test in Chrome (should work)
- Test in Firefox (should work)
- Test in Safari (may require user interaction first)

## File Conversion

### If you have WAV, need MP3:
1. Go to: https://online-audio-converter.com/
2. Upload your WAV file
3. Select MP3 format
4. Set quality: 128 kbps
5. Convert and download

### If you need to trim:
1. Go to: https://mp3cut.net/
2. Upload your MP3
3. Select 1-2 second segment
4. Download trimmed version

## Current Status

❌ **Notification sound needed** - Add your MP3 here  
✅ **Audio player configured** - Ready to use once you add sound  
✅ **Fallback ready** - App works silently without sound  

## Installation

1. **Name your file**: `notification.mp3` (exactly this name)
2. **Save location**: `public/sounds/notification.mp3`
3. **Restart server**: The app will automatically use it!

## Browser Autoplay Policy

**Important**: Modern browsers block autoplay audio until user interacts with the page.

The app handles this by:
- Playing sound only after user clicks/taps
- Notification permission requires user action
- Sound plays reliably after first interaction

## Recommended Sounds

### My Top Picks:
1. **Kitchen timer bell** - Most appropriate
2. **Single chime** - Pleasant and clear
3. **Soft bell** - Gentle reminder

### Where to Find:
- Freesound: https://freesound.org/search/?q=kitchen+timer
- Mixkit: https://mixkit.co/free-sound-effects/notification/
- Zapsplat: https://www.zapsplat.com/sound-effect-category/bells-and-chimes/

## Quick Action

**Fastest way to get started:**

1. Visit: https://notificationsounds.com/
2. Find a pleasant notification sound (1-2 seconds)
3. Download as MP3
4. Rename to `notification.mp3`
5. Save to `public/sounds/`
6. Restart dev server
7. Test by completing a timed step!

Your app will now play a sound when timers complete! 🔔

## Optional: Multiple Sounds

Want different sounds for different timers? You can extend the app:

1. Add multiple sound files: `timer-start.mp3`, `timer-complete.mp3`, `all-done.mp3`
2. Modify `src/hooks/useTimer.ts` to use different sounds
3. Play different sounds based on context

Example:
```typescript
const audio = new Audio('/sounds/timer-complete.mp3');
```

## Troubleshooting

**Sound not playing?**
- Check file name is exactly `notification.mp3`
- Check file location is `public/sounds/`
- Restart dev server
- Check browser console for errors
- Try clicking page first (autoplay policy)

**Sound too loud/quiet?**
- Use Audacity to adjust volume
- Or use: https://www.audiocheck.net/audiofrequencysignalgenerator_sinetone.php

**Format issues?**
- Convert to MP3: https://online-audio-converter.com/
- Ensure bitrate is 128kbps or higher

Now add your sound and enjoy audible timer notifications! 🎵
