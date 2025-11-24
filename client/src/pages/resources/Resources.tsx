import Header from '../../components/header/Header'
import InfoCard from '../../components/info-card/InfoCard'
import styles from './Resources.module.css'

const resources = [
  {
    title: "HamStudy Technician HamBook",
    description:
      "A free, browser-only guide that blends AI-assisted drafting with human editing to walk through Technician topics by concept instead of question order.",
    details: "Free • Web",
    link: "https://hambook.org?ref=hsblog",
    cta: "Read the HamBook",
  },
  {
    title: "KB6NU’s No-Nonsense Guides",
    description:
      "Straightforward PDFs that strip away fluff while still covering everything you need for each exam. Perfect as a companion to question pool practice.",
    details: "Free • Downloadable",
    link: "http://www.kb6nu.com/tech-manual/",
    cta: "Download the guide",
  },
  {
    title: "ARRL License Manual",
    description:
      "Comprehensive print references from the ARRL for learners who want to dive deep and work through every concept before testing.",
    details: "Book • Purchase",
    link: "http://www.arrl.org/ham-radio-license-manual",
    cta: "Shop the manual",
  },
  {
    title: "David Casler Video Guides",
    description:
      "YouTube playlists that cover all three U.S. license pools with classroom-style walkthroughs and visual demos.",
    details: "Free • Video series",
    link: "https://www.youtube.com/channel/UCaBtYooQdmNzq63eID8RaLQ",
    cta: "Watch the channel",
  },
]

function Resources() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Study Resources</h1>
          <p className={styles.subtitle}>Trusted books, guides, and videos to reinforce your ham radio prep.</p>
        </div>
        <div className={styles.grid}>
          {resources.map((resource) => (
            <InfoCard key={resource.title} title={resource.title}>
              <p className={styles.description}>{resource.description}</p>
              <p className={styles.details}>{resource.details}</p>
              <a
                className={styles.link}
                href={resource.link}
                target="_blank"
                rel="noreferrer"
              >
                {resource.cta}
              </a>
            </InfoCard>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Resources
