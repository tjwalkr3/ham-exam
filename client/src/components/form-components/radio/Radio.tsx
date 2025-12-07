import React from 'react';
import styles from './Radio.module.css';

interface RadioProps {
  question: string;
  answers: string[];
  figure?: string | null;
  selectedAnswer: number | null;
  onChange: (index: number) => void;
}

const Radio: React.FC<RadioProps> = ({
  question,
  answers,
  figure,
  selectedAnswer,
  onChange,
}) => {
  return (
    <>
      {figure && (
        <div className={styles.figureContainer}>
          <img 
            src={`/figures/${figure}`} 
            alt="Question Figure" 
            className={styles.figure}
          />
        </div>
      )}
      <h2 className={styles.question}>{question}</h2>
      
      <div className={styles.answers}>
        {answers.map((answer, index) => (
          <button
            key={index}
            className={`${styles.answer} ${selectedAnswer === index ? styles.selected : ''}`}
            onClick={() => onChange(index)}
            type="button"
          >
            <span className={styles.answerLabel}>{String.fromCharCode(65 + index)}.</span>
            <span className={styles.answerText}>{answer}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Radio;
