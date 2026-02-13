import { useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { atom, useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { transitionHome } from "../App";
import { section } from "./Experience";

export const screenAtom = atom("home");
export const transitionAtom = atom(true);
export const cakeAtom = atom(-1);
export const isMobileAtom = atom(false);

export const annotation3d = atom("base");

/** Índice de la escena/flip actual en el tour 360 (para resaltar el locationpoint en el mapa) */
export const currentTourSceneIndexAtom = atom(null);

/** Índice al que navegar desde el mapa (locationpoint click); Recorrido360 lo lee y cambia de escena */
export const tourGotoSceneIndexAtom = atom(null);

export const residenceTogglesAtom = atom({
  "2 Bedroom Garden": false,
  "2 Bedroom": false,
  "3 Bedroom Garden": false,
  "3 Bedroom": false,
  "4 Bedroom": false,
});

export const TRANSITION_DELAY = 0.4;
export const TRANSITION_DURATION = 0.8;
export const CAKE_TRANSITION_DURATION = 2.5;

export const UI = () => {
  const [screen, setScreen] = useAtom(screenAtom);
  const [annotation, setAnnotation] = useAtom(annotation3d);
  const [cake, setCake] = useAtom(cakeAtom);
  const [transition, setTransition] = useAtom(transitionAtom);
  const [transitionHomepage, setTransitionHomepage] = useAtom(transitionHome);
  const [sectionCam, setSectionCam] = useAtom(section);
  const timeout = useRef();
  // const [_, setIsMobile] = useAtom(isMobileAtom);
  const [isMobile, setIsMobile] = useAtom(isMobileAtom);

  const [showResidencesPanel, setShowResidencesPanel] = useState(false);
  const [residenceToggles, setResidenceToggles] = useAtom(residenceTogglesAtom);

  const [activeButton, setActiveButton] = useState(null); // 'residences', 'amenities', 'entrance', or null
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const transitionToScreen = (newScreen) => {
    if (newScreen === "isom") {
      setTransition(true);
    }

    clearTimeout(timeout.current);
    timeout.current = setTimeout(
      () => {
        setScreen(newScreen);
        if (newScreen === "isom") {
          setTransition(false);
        }
      },
      // TRANSITION_DURATION * 0.2 * 1000 + TRANSITION_DELAY * 2 * 1000,
      // TRANSITION_DURATION * 1000 + TRANSITION_DELAY * 1000,
      TRANSITION_DURATION * 0.4 * 1000,
      // TRANSITION_DURATION * 0.01 * 1000,
    );
  };

  const transitionToHomepage = () => {
    setTransition(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(
      () => {
        setTransitionHomepage(false);
        setTransition(false);
      },
      TRANSITION_DURATION * 1000 + TRANSITION_DELAY * 1000,
    );
  };

  const transitionToAnnotation = (newAnnotation) => {
    setAnnotation(newAnnotation);
  };

  useEffect(() => {
    setCake(0);
    setShowResidencesPanel(false);
    setActiveButton(null);
    if (screen !== "pers") setAnnotation("base");
  }, [screen]);

  const handleResidenceToggle = (key) => {
    setResidenceToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleButtonClick = (buttonName) => {
    if (activeButton === buttonName) {
      // Si el botón ya está activo, desactivarlo y volver a "base"
      setActiveButton(null);
      setAnnotation("base");
      if (buttonName === "residences") {
        setShowResidencesPanel(false);
        setAnnotation("base");
      }
    } else {
      // Activar el nuevo botón
      setActiveButton(buttonName);
      if (buttonName === "residences") {
        setShowResidencesPanel(true);
        setAnnotation("residences");
        // Activar todos los toggles cuando se hace clic en el botón Residences
        setResidenceToggles((prev) => {
          const allActive = {};
          Object.keys(prev).forEach((key) => {
            allActive[key] = true;
          });
          return allActive;
        });
      } else {
        setAnnotation(buttonName);
        setShowResidencesPanel(false);
      }
    }
  };

  return (
    <main className="select-none text-[#FFFEF7] text-xl pointer-events-none">
      {/* Logo en esquina superior izquierda */}
      <motion.div
        className={`fixed z-20 ${isMobile ? "top-4 left-4" : "top-[50px] left-[50px]"}`}
        variants={{
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              delay: TRANSITION_DURATION + 0.6,
              duration: 1.5,
            },
          },
          hidden: {
            opacity: 0,
            x: -50,
            transition: {
              duration: 1.5,
            },
          },
        }}
        initial={{
          opacity: 0,
          x: -50,
        }}
        animate={!transition ? "visible" : "hidden"}
      >
        <img
          src="/Soho_Logo.png"
          alt="Soho Logo"
          className={isMobile ? "w-[44px] h-auto" : "w-[50px] h-auto"}
        />
      </motion.div>

      {/* Navegación superior derecha */}
      {isMobile ? (
        <>
          {/* Botón hamburguesa para móvil */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`fixed z-30 top-[26px] right-4 w-10 h-10 flex flex-col justify-center items-center gap-1.5 pointer-events-auto ${
              isMobileMenuOpen ? "" : ""
            }`}
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: TRANSITION_DURATION + 0.6,
                  duration: 1.5,
                },
              },
              hidden: {
                opacity: 0,
                y: -50,
                transition: {
                  duration: 1.5,
                },
              },
            }}
            initial={{
              opacity: 0,
              y: -50,
            }}
            animate={!transition ? "visible" : "hidden"}
          >
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </motion.button>

          {/* Menú desplegable para móvil */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed z-20 top-20 right-4 bg-[#c6c1ae] border-2 border-[#FFFEF7] rounded-lg p-6 flex flex-col justify-evenly items-center min-w-[165px] h-[200px] pointer-events-auto"
              >
                <button
                  onClick={() => {
                    transitionToHomepage();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm bg-transparent hover:opacity-70 font-semibold text-[#fffef7] transition-opacity duration-500 text-center"
                >
                  HOME
                </button>
                <a
                  href="https://www.sohohouse.com/es/houses/soho-house-mexico-city"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm bg-transparent hover:opacity-70 font-semibold text-[#fffef7] transition-opacity duration-500 text-center"
                >
                  SOHO
                </a>
                <a
                  href="https://soma.group/es/company/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm bg-transparent hover:opacity-70 font-semibold text-[#fffef7] transition-opacity duration-500 text-center"
                >
                  SOMA
                </a>
                <a
                  href="https://sordomadaleno.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm bg-transparent hover:opacity-70 font-semibold text-[#fffef7] transition-opacity duration-500 text-center"
                >
                  SM
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          className="fixed z-20 flex flex-row items-center gap-4 top-[70px] right-[50px]"
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: TRANSITION_DURATION + 0.6,
                duration: 1.5,
              },
            },
            hidden: {
              opacity: 0,
              y: -50,
              transition: {
                duration: 1.5,
              },
            },
          }}
          initial={{
            opacity: 0,
            y: -50,
          }}
          animate={!transition ? "visible" : "hidden"}
        >
          <button
            onClick={() => transitionToHomepage()}
            className="text-[21px] bg-transparent hover:opacity-70 font-semibold text-[#FFFEF7] transition-opacity duration-500 pointer-events-auto"
          >
            HOME
          </button>
          <a
            href="https://www.sohohouse.com/es/houses/soho-house-mexico-city"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[21px] bg-transparent hover:opacity-70 font-semibold text-[#FFFEF7] transition-opacity duration-500 pointer-events-auto"
          >
            SOHO
          </a>
          <a
            href="https://soma.group/es/company/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[21px] bg-transparent hover:opacity-70 font-semibold text-[#FFFEF7] transition-opacity duration-500 pointer-events-auto"
          >
            SOMA
          </a>
          <a
            href="https://sordomadaleno.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[21px] bg-transparent hover:opacity-70 font-semibold text-[#FFFEF7] transition-opacity duration-500 pointer-events-auto"
          >
            SM
          </a>
        </motion.div>
      )}

      <motion.h1
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20
      text-[#FFFEF7] text-center font-semibold text-7xl md:text-8xl"
        variants={{
          visible: {
            opacity: 1,
            transition: {
              duration: TRANSITION_DURATION / 2,
              delay: TRANSITION_DURATION - 0.3,
            },
          },
          hidden: {
            opacity: 0,
            transition: {
              duration: TRANSITION_DURATION / 2,
            },
          },
        }}
        initial={{
          opacity: 1,
        }}
        animate={transition ? "visible" : "hidden"}
      >
        {/* SOHO <span className="text-indigo-800">Cabos</span> */}
        <img
          src="/Soho_Logo_Text.png"
          alt="SOHO Cabos"
          className="h-16 md:h-24 mx-auto"
        />
      </motion.h1>
      {/* HOME */}
      <motion.section
        animate={!transition && screen === "home" ? "visible" : "hidden"}
        className={
          //   `z-10 fixed bottom-0 left-0 right-0 w-full md:bottom-auto
          // md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:w-auto md:-translate-x-1/2

          `z-10 fixed
    bottom-0 left-0 right-0 w-full
    md:bottom-20 md:right-20 md:left-auto md:top-auto md:w-auto
    md:translate-x-0 md:translate-y-0

        ${isMobile ? "text-center px-4 pb-8" : "text-left p-4"}
        ${screen === "home" ? "pointer-events-auto" : "pointer-events-none"}`
        }
      >
        <motion.h2
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: TRANSITION_DURATION,
                duration: 1.5,
              },
            },
            hidden: {
              opacity: 0,
              y: 50,
              transition: {
                delay: 0.6,
                duration: 1.5,
              },
            },
          }}
          initial={{
            opacity: 0,
            y: 50,
          }}
          className={`${isMobile ? "text-4xl" : "text-6xl"} font-display text-[#FFFEF7]`}
        >
          {/* SOHO RESIDENCES */}
          <img
            src="/Soho_Logo_Text_Res.png"
            alt="Soho Logo Residences Text"
            className={isMobile ? "w-[400px] h-auto" : "w-[750px] h-auto"}
          />
        </motion.h2>
        <motion.p
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: TRANSITION_DURATION + 0.3,
                duration: 1.5,
              },
            },
            hidden: {
              opacity: 0,
              y: 50,
              transition: {
                delay: 0.3,
                duration: 1.5,
              },
            },
          }}
          initial={{
            opacity: 0,
            y: 50,
          }}
          className={`text-[#FFFEF7] whitespace-pre-line ${isMobile ? "text-sm" : "text-base"}`}
        >
          {/* We are the best{" "} */}
          {isMobile
            ? `Soho House is a place for our diverse membership to connect, grow, have fun, and make an impact.`
            : `Soho House is a place for our diverse membership to connect, grow, have fun, and make an impact.
          From the beginning and throughout our 30-year history, our members have always been at the heart of 
          everything we do.`}
          {/* <span className="text-[#FFFEF7]">lifestyle development</span> in Los
          Cabos */}
        </motion.p>
        <div className="flex flex-col gap-[25%] md:flex-row md:gap-6 mt-4 items-center justify-center md:items-start md:justify-start w-full">
          <motion.button
            onClick={() => transitionToHomepage()}
            className={`text-sm bg-transparent hover:bg-[#C6C1AE] font-semibold
           text-[#FFFEF7] hover:text-[#2E3641] border-2
            border-[#FFFEF7]  transition-colors duration-500 px-4 py-1 mt-2 rounded-lg uppercase w-2/3 md:w-auto ${
              isMobile ? "origin-top scale-y-[0.75]" : ""
            }`}
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: TRANSITION_DURATION + 0.6,
                  duration: 1.5,
                },
              },
              hidden: {
                opacity: 0,
                y: 50,
                transition: {
                  duration: 1.5,
                },
              },
            }}
            initial={{
              opacity: 0,
              y: 50,
            }}
          >
            Home
          </motion.button>

          <motion.button
            onClick={() => {
              transitionToScreen("pers");
              handleButtonClick("masterplan");
              setSectionCam(1);
            }}
            className={`text-sm bg-transparent hover:bg-[#C6C1AE] font-semibold
           text-[#FFFEF7] hover:text-[#2E3641] border-2
            border-[#FFFEF7]  transition-colors duration-500 px-4 py-1 mt-2 rounded-lg uppercase w-2/3 md:w-auto ${
              activeButton === "masterplan"
            } ${isMobile ? "origin-top scale-y-[0.75]" : ""}`}
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: TRANSITION_DURATION + 0.6,
                  duration: 1.5,
                },
              },
              hidden: {
                opacity: 0,
                y: 50,
                transition: {
                  duration: 1.5,
                },
              },
            }}
            initial={{
              opacity: 0,
              y: 50,
            }}
          >
            Experience
          </motion.button>
        </div>
      </motion.section>

      {/* ------------------- */}

      {/* VISTAS */}
      <motion.section
        animate={!transition && screen === "pers" ? "visible" : "hidden"}
        className={`${
          screen === "pers" ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* <div className="z-10 fixed bottom-4 left-0 w-full md:w-auto md:left-1/2 md:-translate-x-1/2 text-center  p-4"> */}

        <div
          className="z-10 fixed bottom-4 left-0 w-full md:w-auto md:left-1/2 md:-translate-x-1/2
            text-center p-4 flex flex-col gap-[25%] md:flex-row md:gap-6 items-center justify-center md:items-start md:justify-start"
        >
          <motion.button
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: TRANSITION_DURATION * 0.3,
                  duration: 1.5,
                },
              },
              hidden: {
                opacity: 0,
                y: 50,
                transition: {
                  duration: 1.5,
                },
              },
            }}
            initial={{
              opacity: 0,
              y: 50,
            }}
            // onClick={() => transitionToScreen("home")}
            className={`text-sm font-medium border-2 transition-colors duration-500 px-4 py-1 mt-2 rounded-lg w-1/2 md:w-auto ${
              activeButton === "residences"
                ? "bg-[#C6C1AE] text-[#2E3641] border-[#FFFEF7] hover:text-[#2E3641]"
                : "bg-transparent hover:bg-[#C6C1AE] text-[#FFFEF7] hover:text-[#2E3641] border-[#FFFEF7]"
            } ${isMobile ? "origin-top scale-y-[0.75]" : ""}`}
            onClick={() => {
              handleButtonClick("residences");
              setSectionCam(2);
            }}
          >
            Residences
          </motion.button>

          <motion.button
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: TRANSITION_DURATION * 0.3,
                  duration: 1.5,
                },
              },
              hidden: {
                opacity: 0,
                y: 50,
                transition: {
                  duration: 1.5,
                },
              },
            }}
            initial={{
              opacity: 0,
              y: 50,
            }}
            // onClick={() => transitionToScreen("home")}
            className={`text-sm font-medium border-2 transition-colors duration-500 px-4 py-1 mt-2 rounded-lg w-1/2 md:w-auto ${
              activeButton === "amenities"
                ? "bg-[#C6C1AE] text-[#2E3641] border-[#FFFEF7] hover:text-[#2E3641]"
                : "bg-transparent hover:bg-[#C6C1AE] text-[#FFFEF7] hover:text-[#2E3641] border-[#FFFEF7]"
            } ${isMobile ? "origin-top scale-y-[0.75]" : ""}`}
            onClick={() => {
              handleButtonClick("amenities");
              setSectionCam(3);
            }}
          >
            Amenities
          </motion.button>

          <motion.button
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: TRANSITION_DURATION * 0.3,
                  duration: 1.5,
                },
              },
              hidden: {
                opacity: 0,
                y: 50,
                transition: {
                  duration: 1.5,
                },
              },
            }}
            initial={{
              opacity: 0,
              y: 50,
            }}
            // onClick={() => transitionToScreen("home")}
            className={`text-sm font-medium border-2 transition-colors duration-500 px-4 py-1 mt-2 rounded-lg w-1/2 md:w-auto ${
              activeButton === "entrance"
                ? "bg-[#C6C1AE] text-[#2E3641] border-[#FFFEF7] hover:text-[#2E3641]"
                : "bg-transparent hover:bg-[#C6C1AE] text-[#FFFEF7] hover:text-[#2E3641] border-[#FFFEF7]"
            } ${isMobile ? "origin-top scale-y-[0.75]" : ""}`}
            onClick={() => {
              handleButtonClick("casita");
              setSectionCam(4);
            }}
          >
            Casita
          </motion.button>

          <motion.button
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: TRANSITION_DURATION * 0.3,
                  duration: 1.5,
                },
              },
              hidden: {
                opacity: 0,
                y: 50,
                transition: {
                  duration: 1.5,
                },
              },
            }}
            initial={{
              opacity: 0,
              y: 50,
            }}
            onClick={() => {
              transitionToScreen("home");
              setSectionCam(0);
            }}
            className={`bg-transparent hover:bg-[#C6C1AE] text-sm font-medium text-[#FFFEF7] hover:text-[#2E3641] border-2 border-[#FFFEF7]  transition-colors duration-500 px-4 py-1 mt-2 rounded-lg w-1/2 md:w-auto ${
              isMobile ? "origin-top scale-y-[0.25]" : ""
            }`}
          >
            Return
          </motion.button>
        </div>

        <motion.div
          initial={{ x: -220, opacity: 0, y: "-50%" }}
          animate={
            !transition && screen === "pers" && showResidencesPanel
              ? { x: 0, opacity: 1, y: "-50%" }
              : { x: -220, opacity: 0, y: "-50%" }
          }
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          // className="fixed left-4 top-1/2 -translate-y-1/2 z-20 w-52 scale-[1.5] origin-center bg-transparent border border-white/30 rounded-xl p-4 flex flex-col gap-3 pointer-events-auto"

          className="fixed left-4 top-1/2 z-20 w-60 origin-center bg-transparent border-2 border-[#FFFEF7] rounded-xl p-2 py-1 flex flex-col gap-2 pointer-events-auto"
        >
          <div className="flex py-1 items-center justify-between">
            <p className="text-lg font-semibold">Residences</p>
            <button
              className="text-sm text-[#FFFEF7]/70 hover:text-[#2E3641] transition-colors"
              onClick={() => {
                setShowResidencesPanel(false);
                setActiveButton(null);
                setAnnotation("base");
              }}
            >
              X
            </button>
          </div>
          {Object.entries(residenceToggles).map(([label, active]) => (
            <button
              key={label}
              aria-pressed={active}
              onClick={() => handleResidenceToggle(label)}
              className={`flex items-center justify-between rounded-lg px-3 py-0 text-sm font-semibold border transition-colors ${
                active
                  ? "bg-[#C6C1AE] text-[#2E3641] border-[#FFFEF7] hover:bg-[#C6C1AE] hover:text-[#2E3641]"
                  : "bg-white/10 text-[#FFFEF7] border-[#FFFEF7]/50 hover:bg-[#C6C1AE] hover:text-[#2E3641]"
              }`}
            >
              <span>{label}</span>
              <span
                className={`relative h-4 w-6 rounded-full transition-colors ${
                  active ? "bg-black" : "bg-white/30"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full transition-colors ${
                    active ? "bg-white" : "bg-white"
                  }
                  
                    transition-transform ${active ? "translate-x-2" : ""}`}
                />
              </span>
            </button>
          ))}
        </motion.div>
      </motion.section>

      {/* MENU */}
      {/* <motion.section
        animate={!transition && screen === "menu" ? "visible" : "hidden"}
        className={`${
          screen === "menu" ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {cakes.map((item, idx) => (
          <motion.div
            key={idx}
            className="fixed top-[15%] w-full md:w-auto md:left-1/2 md:-translate-x-1/2 text-center  p-4 z-10"
            animate={
              !transition && cake === idx && screen === "menu"
                ? "visible"
                : "hidden"
            }
          >
            <motion.h3
              variants={{
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: CAKE_TRANSITION_DURATION,
                    duration: 1.5,
                  },
                },
                hidden: {
                  opacity: 0,
                  y: 50,
                  transition: {
                    duration: 1,
                    delay: 0.3,
                  },
                },
              }}
              initial={{
                opacity: 0,
                y: 50,
              }}
              className="text-5xl md:text-7xl font-semibold text-indigo-300"
            >
              {item.name}
            </motion.h3>
            <motion.p
              className="text-white/80"
              variants={{
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: CAKE_TRANSITION_DURATION + 0.3,
                    duration: 1,
                  },
                },
                hidden: {
                  opacity: 0,
                  y: 50,
                  transition: {
                    duration: 1.5,
                  },
                },
              }}
              initial={{
                opacity: 0,
                y: 50,
              }}
            >
              {item.description}
            </motion.p>
          </motion.div>
        ))}
        <div className="z-10 fixed bottom-4 left-0 w-full md:w-auto md:left-1/2 md:-translate-x-1/2 text-center  p-4">
          <motion.h2
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: TRANSITION_DURATION - 0.6,
                  duration: 1.5,
                },
              },
              hidden: {
                opacity: 0,
                y: 50,
                transition: {
                  duration: 1.5,
                },
              },
            }}
            initial={{
              opacity: 0,
              y: 50,
            }}
            className="text-6xl font-display"
          >
            La Carte
          </motion.h2>
          <motion.p
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: TRANSITION_DURATION - 0.3,
                  duration: 1.5,
                },
              },
              hidden: {
                opacity: 0,
                y: 50,
                transition: {
                  duration: 1.5,
                },
              },
            }}
            initial={{
              opacity: 0,
              y: 50,
            }}
            className="text-white/80"
          >
            Discover our selection of desserts!
          </motion.p>
          <motion.button
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: TRANSITION_DURATION,
                  duration: 1.5,
                },
              },
              hidden: {
                opacity: 0,
                y: 50,
                transition: {
                  duration: 1.5,
                },
              },
            }}
            initial={{
              opacity: 0,
              y: 50,
            }}
            onClick={() => transitionToScreen("home")}
            className="bg-transparent hover:bg-white font-medium text-white hover:text-black border-2 border-white  transition-colors duration-500 px-4 py-2 mt-4 rounded-lg"
          >
            Back
          </motion.button>
        </div>
        <motion.button
          variants={{
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                delay: TRANSITION_DURATION - 0.6,
                duration: 1.5,
              },
            },
            hidden: {
              opacity: 0,
              x: -50,
              transition: {
                duration: 1.5,
              },
            },
          }}
          initial={{
            opacity: 0,
            x: -50,
          }}
          className="fixed left-4 md:left-1/4 top-1/2 -translate-y-1/2 z-10"
          onClick={() =>
            setCake((cake) => (cake - 1 + cakes.length) % cakes.length)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 stroke-white/70 hover:stroke-white transition-colors duration-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </motion.button>
        <motion.button
          className="fixed right-4 md:right-1/4 top-1/2 -translate-y-1/2 z-10"
          variants={{
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                delay: TRANSITION_DURATION - 0.6,
                duration: 1.5,
              },
            },
            hidden: {
              opacity: 0,
              x: 50,
              transition: {
                duration: 1.5,
              },
            },
          }}
          initial={{
            opacity: 0,
            x: 50,
          }}
          onClick={() => setCake((cake) => (cake + 1) % cakes.length)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 stroke-white/70 hover:stroke-white transition-colors duration-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </motion.button>
      </motion.section> */}
    </main>
  );
};
