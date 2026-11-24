import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../App.css'

gsap.registerPlugin(ScrollTrigger)

const characterAsset = (file: string) => `${import.meta.env.BASE_URL}characters/kenney/${file}`

type PersonProps = {
  detailed?: boolean
  className?: string
}

function Person({ detailed = false, className = '' }: PersonProps) {
  return (
    <img
      className={`person-svg ${className}`}
      src={characterAsset('stand.png')}
      alt=""
      draggable={false}
      data-animated={detailed || undefined}
    />
  )
}

const scenes = ['Opening', 'Release day', 'The community']

export default function Home() {
  const storyRef = useRef<HTMLElement>(null)
  const [activeScene, setActiveScene] = useState(0)

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setActiveScene(2)
      return
    }

    const ctx = gsap.context(() => {
      const addWalkCycle = (at: number) => {
        // Scroll-scrubbed Kenney sprite sequence: eight poses, one shared silhouette.
        for (let index = 0; index < 8; index++) {
          tl.set('.protagonist .person-svg', {
            attr: { src: characterAsset(`walk-${index}.png`) },
          }, at + index * 0.09)
        }
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
          onUpdate: (self) => {
            const next = self.progress < 0.29 ? 0 : self.progress < 0.68 ? 1 : 2
            setActiveScene((current) => current === next ? current : next)
          },
        },
      })

      tl.to('.crowd', { opacity: 0, scale: 0.94, duration: 0.55 }, 0.22)
        .to('.opening-rule', { scaleX: 0, duration: 0.4 }, 0.25)
        .fromTo('.prison', { opacity: 0 }, { opacity: 1, duration: 0.55 }, 0.38)
        .fromTo('.protagonist', { opacity: 0, scale: 0.42, yPercent: 24 }, { opacity: 1, scale: 0.55, yPercent: 20, duration: 0.5 }, 0.55)
        .to('.gate-left', { xPercent: -34, duration: 1.1 }, 0.95)
        .to('.gate-right', { xPercent: 34, duration: 1.1 }, 0.95)
        .to('.gate-bars', { opacity: 0, duration: 0.6 }, 1.28)
        .to('.protagonist', { scale: 1.38, yPercent: -3, duration: 1.2 }, 1.05)
        .to('.prison', { opacity: 0, duration: 0.7 }, 2.02)
        .fromTo('.community', { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.9 }, 1.94)
        .fromTo('.road', { opacity: 0 }, { opacity: 1, duration: 0.55 }, 2.04)
        .to('.protagonist', { scale: 1.08, xPercent: -48, yPercent: 3, duration: 0.85 }, 2.18)

      ;[0.85, 1.57, 2.29].forEach(addWalkCycle)
      tl.set('.protagonist .person-svg', {
        attr: { src: characterAsset('stand.png') },
      }, 3.01)
    }, storyRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="#opening" aria-label="After Release, back to opening">AFTER RELEASE</a>
        <a className="about-link" href="#methodology">About the data</a>
      </header>

      <main>
        <section className="story" ref={storyRef} aria-label="After Release, animated story prototype">
          <div className={`visual-stage scene-${activeScene}`} aria-hidden="true">
            <div className="crowd">
              {Array.from({ length: 135 }, (_, index) => <Person key={index} />)}
            </div>

            <div className="community">
              <div className="building building-one" />
              <div className="building building-two" />
              <div className="hospital">
                <div className="hospital-name">HOSPITAL</div>
                <svg className="hospital-cross" viewBox="0 0 40 40">
                  <path d="M15 5 H25 V15 H35 V25 H25 V35 H15 V25 H5 V15 H15 Z" fill="currentColor" />
                </svg>
                <div className="hospital-door" />
              </div>
            </div>

            <div className="road"><span /></div>

            <div className="prison">
              <div className="prison-wall gate-left" />
              <div className="prison-wall gate-right" />
              <div className="gate-top" />
              <div className="gate-bars">
                {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
              </div>
              <div className="prison-label">RELEASE DAY</div>
            </div>

            <div className="protagonist"><Person detailed /></div>
            <div className="opening-rule" />

            <div className="stage-meta">
              <span>{scenes[activeScene]}</span>
              <span>Scenes 00—02 · Prototype</span>
            </div>
          </div>

          <div className="steps">
            <section className="step step-opening" id="opening" aria-labelledby="opening-title">
              <div className="step-copy opening-copy">
                <p className="chapter-label">A CONTINUITY OF CARE STORY</p>
                <h1 id="opening-title">After Release,<br />Does Care Follow?</h1>
                <p className="standfirst">A story about continuity of healthcare between prison and the community.</p>
                <p className="sample-note">A fictionalised story based on <em>Patient Perspectives: Prison Leavers CORE20PLUS5</em>. The consultation involved <strong>135 people on probation</strong>.</p>
                <a className="scroll-cue" href="#release"><span>Begin the story</span><span aria-hidden="true">↓</span></a>
              </div>
            </section>

            <section className="step" id="release" aria-labelledby="release-title">
              <div className="step-copy">
                <p className="chapter-label">01 · RELEASE DAY</p>
                <h2 id="release-title">Leaving prison</h2>
                <p>On release day, he carried his belongings out of prison.</p>
                <p>But his treatment, medication and follow-up care did not necessarily travel with him.</p>
              </div>
            </section>

            <section className="step" id="community" aria-labelledby="community-title">
              <div className="step-copy">
                <p className="chapter-label">02 · THE COMMUNITY</p>
                <h2 id="community-title">Returning to the community</h2>
                <p>Returning to the community did not automatically mean returning to healthcare.</p>
              </div>
            </section>
          </div>
        </section>
      </main>

      <footer className="methodology" id="methodology">
        <p className="chapter-label">ABOUT THIS PROTOTYPE</p>
        <p>This version contains the opening, prison-release and community-transition scenes. The character and story are fictionalised composites; the sample statement comes from the supplied report.</p>
        <a href="https://media.tghn.org/medialibrary/2023/08/Prison_Leaver_CORE20PLUS5_report.pdf" target="_blank" rel="noreferrer">Read the source report <span aria-hidden="true">↗</span></a>
      </footer>
    </div>
  )
}
