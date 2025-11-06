import { useState } from 'react'
import styles from './Question.module.css'

function Question() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleNext = () => {
    console.log('Next question');
  };

  const handleBack = () => {
    console.log('Previous question');
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const question = "Why is it not legal to transmit a 3 kHz bandwidth USB signal with a carrier frequency of 14.348 MHz?";
  const answers = [
    "USB is not used on 20-meter phone",
    "The lower 1 kHz of the signal is outside the 20-meter band",
    "14.348 MHz is outside the 20-meter band",
    "The upper 1 kHz of the signal is outside the 20-meter band"
  ];

  return (
    <div className={styles.card}>
      <h2 className={styles.question}>{question}</h2>
      
      <div className={styles.answers}>
        {answers.map((answer, index) => (
          <button
            key={index}
            className={`${styles.answer} ${selectedAnswer === index ? styles.selected : ''}`}
            onClick={() => handleAnswerSelect(index)}
            type="button"
          >
            <span className={styles.answerLabel}>{String.fromCharCode(65 + index)}.</span>
            <span className={styles.answerText}>{answer}</span>
          </button>
        ))}
      </div>

      <div className={styles.navigation}>
        <button 
          className={styles.navButton}
          onClick={handleBack}
          type="button"
        >
          Back
        </button>
        <button 
          className={styles.navButton}
          onClick={handleNext}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Question
