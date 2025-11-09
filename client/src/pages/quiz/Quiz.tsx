import Header from '../../components/header/Header'
import Question from '../../components/question/Question'
import styles from './Quiz.module.css'
import type { Questions } from '../../zod-types/questionModel'

function Quiz() {
  const questions: Questions = [
    {
      id: "E1A01",
      correct: 3,
      refs: "[97.305, 97.307(b)]",
      question: "Why is it not legal to transmit a 3 kHz bandwidth USB signal with a carrier frequency of 14.348 MHz?",
      answers: [
        "USB is not used on 20-meter phone",
        "The lower 1 kHz of the signal is outside the 20-meter band",
        "14.348 MHz is outside the 20-meter band",
        "The upper 1 kHz of the signal is outside the 20-meter band"
      ]
    },
    {
      id: "E1A02",
      correct: 3,
      refs: "[97.301, 97.305]",
      question: "When using a transceiver that displays the carrier frequency of phone signals, which of the following displayed frequencies represents the lowest frequency at which a properly adjusted LSB emission will be totally within the band?",
      answers: [
        "The exact lower band edge",
        "300 Hz above the lower band edge",
        "1 kHz above the lower band edge",
        "3 kHz above the lower band edge"
      ]
    },
    {
      id: "T1A01",
      correct: 2,
      refs: "[97.1]",
      question: "Which of the following is part of the Basis and Purpose of the Amateur Radio Service?",
      answers: [
        "Providing personal radio communications for as many citizens as possible",
        "Providing communications for international non-profit organizations",
        "Advancing skills in the technical and communication phases of the radio art",
        "All these choices are correct"
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Question questions={questions} />
      </main>
    </div>
  )
}

export default Quiz
