import { useState } from 'react'
import type { ReactNode } from 'react'
import styles from './Carousel.module.css'

interface CarouselProps {
  items: ReactNode[];
  onNextEnabled?: (index: number) => boolean;
}

function Carousel({ items, onNextEnabled }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const isNextDisabled = onNextEnabled 
    ? !onNextEnabled(currentIndex) || currentIndex === items.length - 1
    : currentIndex === items.length - 1;

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
          Next
        </button>
      </div>
    </div>
  )
}

export default Carousel
