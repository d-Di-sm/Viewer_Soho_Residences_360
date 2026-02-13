import { forwardRef } from "react";

export const Hero = forwardRef(({}, ref) => {
  return (
    <section className="hero" id="hero" ref={ref}>
      <video
        className="hero__video"
        src="/videos/Intro.mp4"
        autoPlay
        loop
        muted
      />

      <div className="hero__body">
        <h1 className="hero__body__title">Applied Innovation and Technology</h1>
        <p className="hero__body__subtitle">
          Innovation in Architectural Solutions
        </p>
      </div>
    </section>
  );
});
