import { useEffect, useRef, useState } from "react";
import { Environment, View } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import { Hero } from "./Hero";
import { VideoIntro } from "./Video";
import { useAtom } from "jotai";

import { transitionHome } from "../App";

export const HomePage = () => {
  // VIDEOS CON CSS
  const videoRef = useRef(null);
  const serviceVideos = ["/videos/01.mp4", "/videos/02.mp4", "/videos/03.mp4"];

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [currentService, setCurrentService] = useState(0);

  // VIDEOS PLAY CON CSS
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.src = serviceVideos[currentService];

    v.load();

    const playPromise = v.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  }, [currentService]);

  const [transitionHomepage, setTransitionHomepage] = useAtom(transitionHome);

  const transitionToHomepage = () => {
    setTransitionHomepage(true);
  };

  return (
    <main>
      <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <div className="header__menu">
          <a href="#hero" className="header__menu__item">
            Home
          </a>
          <a href="#services" className="header__menu__item">
            Services
          </a>
          <a href="#team" className="header__menu__item">
            Expertise
          </a>
          <a href="#portfolio" className="header__menu__item">
            Team
          </a>
          <a href="#contact" className="header__menu__item">
            Interactive
          </a>
        </div>
      </header>

      <Hero />

      <section className="services" id="services">
        <h2 className="services__title">Our Services</h2>
        <div className="services__slider">
          <div className="services__slider__display">
            <video
              ref={videoRef}
              className="services__video"
              src="/videos/01.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
          <div className="services__slider__list">
            <div
              className={`services__slider__list__service ${
                currentService === 0
                  ? "services__slider__list__service--active"
                  : ""
              }`}
              onClick={() => setCurrentService(0)}
            >
              <h3 className="services__slider__list__service__title">
                Web/Mobile App Development
              </h3>
              <p className="services__slider__list__service__description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam voluptatum, quas, voluptate, voluptas quae quod
                quibusdam voluptatibus quia quos molestiae natus? Quisquam
                voluptatum, quas, voluptate, voluptas quae quod quibusdam
                voluptatibus quia quos molestiae natus?
              </p>
            </div>
            <div
              className={`services__slider__list__service ${
                currentService === 1
                  ? "services__slider__list__service--active"
                  : ""
              }`}
              onClick={() => setCurrentService(1)}
            >
              <h3 className="services__slider__list__service__title">
                VR/AR App Development
              </h3>
              <p className="services__slider__list__service__description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam voluptatum, quas, voluptate, voluptas quae quod
                quibusdam voluptatibus quia quos molestiae natus? Quisquam
                voluptatum, quas, voluptate, voluptas quae quod quibusdam
                voluptatibus quia quos molestiae natus?
              </p>
            </div>
            <div
              className={`services__slider__list__service ${
                currentService === 2
                  ? "services__slider__list__service--active"
                  : ""
              }`}
              onClick={() => setCurrentService(2)}
            >
              <h3 className="services__slider__list__service__title">
                Animations
              </h3>
              <p className="services__slider__list__service__description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam voluptatum, quas, voluptate, voluptas quae quod
                quibusdam voluptatibus quia quos molestiae natus? Quisquam
                voluptatum, quas, voluptate, voluptas quae quod quibusdam
                voluptatibus quia quos molestiae natus?
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="team" id="team">
        <h2 className="team__title">Expertise</h2>
        <p className="team__subtitle">
          We are a team of 3D web and mobile developers, designers and artists.
          Our goal is to build the best 3D experiences to make your business
          stand out.
        </p>
        <div className="team__member">
          <div className="team__member__body">
            <p className="team__member__body__name">Concept Design</p>
            <p className="team__member__body__title">CEO</p>
            <p className="team__member__body__description">
              ‟Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptatum, quas, voluptate, voluptas quae quod quibusdam
              voluptatibus quia quos molestiae natus?”
            </p>
          </div>

          <div className="team__member__display team__member__display--blue">
            <img
              src="/Images/01.png"
              alt="Image01"
              className="team__member__image"
            />
          </div>
        </div>
        <div className="team__member team__member--reverse">
          <div className="team__member__body">
            <p className="team__member__body__name">Performance Analysis</p>
            <p className="team__member__body__title">Lead Developer</p>
            <p className="team__member__body__description">
              ‟Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptatum, quas, voluptate, voluptas quae quod quibusdam
              voluptatibus quia quos molestiae natus?”
            </p>
          </div>

          <div className="team__member__display team__member__display--pink">
            <img
              src="/Images/02.png"
              alt="Image02"
              className="team__member__image"
            />
          </div>
        </div>
        <div className="team__member">
          <div className="team__member__body">
            <p className="team__member__body__name">Strategic Visual Content</p>
            <p className="team__member__body__title">3D Artist</p>
            <p className="team__member__body__description">
              ‟Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptatum, quas, voluptate, voluptas quae quod quibusdam
              voluptatibus quia quos molestiae natus?”
            </p>
          </div>

          <div className="team__member__display team__member__display--orange">
            <img
              src="/Images/03.png"
              alt="Image03"
              className="team__member__image"
            />
          </div>
        </div>

        <div className="team__member team__member--reverse">
          <div className="team__member__body">
            <p className="team__member__body__name">
              Material and Fabrication Design
            </p>
            <p className="team__member__body__title">Lead Developer</p>
            <p className="team__member__body__description">
              ‟Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptatum, quas, voluptate, voluptas quae quod quibusdam
              voluptatibus quia quos molestiae natus?”
            </p>
          </div>

          <div className="team__member__display team__member__display--pink">
            <img
              src="/Images/04.png"
              alt="Image04"
              className="team__member__image"
            />
          </div>
        </div>
      </section>
      <section className="portfolio" id="portfolio">
        <h2 className="portfolio__title">Our Team</h2>
        <p className="portfolio__subtitle">
          We have worked on amazing projects for our clients. Here are some of
          them.
        </p>

        <div className="portfolio__display">
          <img
            src="/Images/05.png"
            alt="Image05"
            className="portfolio__image"
          />
        </div>
      </section>
      <section className="contact" id="contact">
        <div className="interactive">
          <button
            className="interactive__button"
            onClick={() => transitionToHomepage()}
          >
            Interactive
          </button>
        </div>
        <h2 className="contact__title">Contact Us</h2>
        <form className="contact__form">
          <div>
            <input
              className="contact__form__input"
              type="text"
              placeholder="Name"
            />
          </div>
          <div>
            <input
              className="contact__form__input"
              type="email"
              placeholder="Email"
            />
          </div>
          <div>
            <textarea
              className="contact__form__textarea"
              placeholder="Message"
            ></textarea>
          </div>
          <div>
            <button className="contact__form__button">Send</button>
          </div>
        </form>
      </section>
    </main>
  );
};
