import { useState } from 'react'
import type { ReactNode } from 'react'
import styles from './Carousel.module.css'

interface CarouselProps {
  items: ReactNode[];
  onNextEnabled?: (index: number) => boolean;
  onComplete?: () => void;
}

function Carousel({ items, onNextEnabled, onComplete }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === items.length - 1 && onComplete) {
      onComplete();
    }
  };

  const isNextDisabled = onNextEnabled 
    ? !onNextEnabled(currentIndex)
    : false;

  const isLastItem = currentIndex === items.length - 1;
  const buttonText = isLastItem && onComplete ? 'Finish' : 'Next';

  return (
    <div className={styles.carousel}>
      <div className={styles.content}>
        {items[currentIndex]}
      </div>
      
      <div className={styles.navigation}>
        <span className={styles.counter}>
          {currentIndex + 1} / {items.length}
        </span>
        <button 
          className={styles.nextButton}
          onClick={handleNext}
          type="button"
          disabled={isNextDisabled}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default Carousel
