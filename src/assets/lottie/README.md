# Placeholder Lottie Animations

This directory should contain Lottie animation JSON files for stunning cooking animations.

## Recommended Animations

1. **chef-cooking.json** - Animated chef stirring pot (for header)
2. **pot-boiling.json** - Boiling pot animation (for active cooking steps)
3. **timer-complete.json** - Celebration/checkmark animation (when timer completes)
4. **celebration.json** - Confetti or party animation (when all steps completed)

## Where to Get Lottie Animations

### Free Sources:
- **LottieFiles**: https://lottiefiles.com/
  - Search for: "cooking", "chef", "timer", "kitchen", "pot", "celebration"
  - Filter by: Free license
  - Download as JSON

### Premium Sources:
- **IconScout**: https://iconscout.com/lottie-animations
- **LottieFiles Premium**: https://lottiefiles.com/pricing

## How to Use

1. Download your chosen Lottie animation
2. Save the JSON file in this directory (src/assets/lottie/)
3. Import in your component:
   ```typescript
   import animationData from '../assets/lottie/chef-cooking.json';
   import AnimatedIcon from '../components/Icons/AnimatedIcon';
   
   <AnimatedIcon animationData={animationData} className="w-32 h-32" />
   ```

## Tips

- Keep file sizes under 50KB for good performance
- Preview animations on LottieFiles before downloading
- Ensure animations loop smoothly if intended to loop
- Test on mobile devices for performance

## Optional Integration

If you want to add a hero animation to the header:
1. Download a chef cooking animation
2. Import it in `src/App.tsx`
3. Add it to the header section using the `AnimatedIcon` component
