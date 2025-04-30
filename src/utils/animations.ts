/**
 * Modular page animation function that can be used across the application
  @param direction - The direction of the transition ('up', 'down', 'left', 'right')
 */
export const pageAnimation = (direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
  const getTransformValue = (dir: string) => {
    switch (dir) {
      case 'up':
        return 'translateY(100%)';
      case 'down':
        return 'translateY(-100%)';
      case 'left':
        return 'translateX(100%)';
      case 'right':
        return 'translateX(-100%)';
      default:
        return 'translateY(100%)';
    }
  };

  document.documentElement.animate(
    [
      {
        opacity: 1,
        scale: 1,
        transform: 'translate(0)',
      },
      {
        opacity: 0.2,
        scale: 1,
        transform: 'translate(0)',
      },
    ],
    {
      duration: 400,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    }
  );

  document.documentElement.animate(
    [
      { 
        transform: getTransformValue(direction),
      },
      {
        transform: 'translate(0)',
      },
    ],
    {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    }
  );
};