import React from 'react';
import Lottie from 'lottie-react';

interface AnimatedIconProps {
  animationData: unknown;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  animationData,
  className = 'w-32 h-32',
  loop = true,
  autoplay = true,
}) => {
  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
};

export default AnimatedIcon;
