import { motion, AnimatePresence } from "framer-motion";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  isMobileAtom,
  transitionAtom,
  currentTourSceneIndexAtom,
  tourGotoSceneIndexAtom,
} from "../UI";
import {
  TourModes,
  useTourCustomization,
} from "../../contexts/CustomizationContextTour.jsx";

const TRANSITION_DURATION = 0.8;

const UI360 = ({
  onHomeClick,
  onInfoClick,
  onMapaClick,
  onReturnClick,
  imageMap,
  locationpoints = [],
  spaces = [],
}) => {
  const [isMobile] = useAtom(isMobileAtom);
  const [transition] = useAtom(transitionAtom);
  const [currentTourSceneIndex] = useAtom(currentTourSceneIndexAtom);
  const [, setTourGotoSceneIndex] = useAtom(tourGotoSceneIndexAtom);
  const [activeButton, setActiveButton] = useState(null); // 'info', 'mapa', 'return' or null
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLocationIndex, setHoveredLocationIndex] = useState(null);
  const { tourMode, setTourMode } = useTourCustomization();

  // Si se cierra el modal (tourMode deja de ser INFO), desactivar visualmente el botón Info
  useEffect(() => {
    if (tourMode !== TourModes.INFO && activeButton === "info") {
      setActiveButton(null);
    }
  }, [tourMode, activeButton]);

  // Al iniciar transición de vuelta al 3d, cerrar menú hamburguesa
  useEffect(() => {
    if (transition) setIsMobileMenuOpen(false);
  }, [transition]);

  const handleActionButtonClick = (buttonName) => {
    const isSameButton = activeButton === buttonName;

    // Toggle del estado visual del botón
    setActiveButton(isSameButton ? null : buttonName);

    // Solo disparamos side-effects cuando se ACTIVA el botón
    if (!isSameButton) {
      if (buttonName === "info") {
        // Activa el panel flotante (Overlay360) en modo INFO
        setTourMode(TourModes.INFO);
        if (onInfoClick) onInfoClick();
      }

      if (buttonName === "mapa") {
        if (onMapaClick) onMapaClick();
      }
    }
  };

  const handleReturnClick = () => {
    if (onReturnClick) onReturnClick();
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

      {/* Navegación superior derecha: HOME, SOHO, SOMA, SM */}
      {isMobile ? (
        <>
          {/* Botón hamburguesa para móvil */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="fixed z-30 top-[26px] right-4 w-10 h-10 flex flex-col justify-center items-center gap-1.5 pointer-events-auto"
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
                transition: { duration: 1.5 },
              },
            }}
            initial={{ opacity: 0, y: -50 }}
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
                    onHomeClick?.();
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
              transition: { duration: 1.5 },
            },
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={!transition ? "visible" : "hidden"}
        >
          <button
            onClick={() => onHomeClick?.()}
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

      {/* Mapa: imagen en parte inferior izquierda cuando Mapa está activo */}
      <AnimatePresence>
        {activeButton === "mapa" && imageMap && (
          <motion.div
            key="mapa-image"
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`fixed z-20 pointer-events-auto overflow-hidden bg-transparent ${
              isMobile
                ? "bottom-[calc(45vh-150px)] -translate-x-1/2 w-[100vw] max-w-[100vw] max-h-[45vh]"
                : "bottom-4 left-4 max-w-[min(630px,100vw)] max-h-[min(450px,78.75vh)]"
            }`}
          >
            <img
              src={
                imageMap.startsWith(".")
                  ? imageMap.replace(/^\.\/?/, "/")
                  : imageMap
              }
              alt="Mapa"
              className="w-full h-full object-contain opacity-75"
            />
            {Array.isArray(locationpoints) &&
              locationpoints.map((pos, i) => {
                const x = Array.isArray(pos) ? pos[0] : pos.x;
                const y = Array.isArray(pos) ? pos[1] : pos.y;
                const isActive =
                  currentTourSceneIndex !== null && currentTourSceneIndex === i;
                const tooltipText =
                  Array.isArray(spaces) && spaces[i] != null
                    ? spaces[i]
                    : `Vista ${i + 1}`;
                const showTooltip = hoveredLocationIndex === i;
                return (
                  <div
                    key={i}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px]"
                    style={{
                      left: `${(x ?? 0) * 100}%`,
                      top: `${(y ?? 0) * 100}%`,
                      zIndex: showTooltip ? 20 : 0,
                    }}
                    onMouseEnter={() => setHoveredLocationIndex(i)}
                    onMouseLeave={() => setHoveredLocationIndex(null)}
                  >
                    <button
                      type="button"
                      className={`circle-button-map absolute left-0 top-0${isActive ? " circle-button-map-active" : ""}`}
                      onClick={() => setTourGotoSceneIndex(i)}
                      aria-label={tooltipText}
                    />
                    {showTooltip && (
                      <div className="tooltip-3d tooltip-3d-map">
                        {tooltipText}
                      </div>
                    )}
                  </div>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botones Info, Mapa, Return (mismo estilo que Residences / Amenities) */}
      <div
        className="z-10 fixed bottom-4 left-0 w-full md:w-auto md:left-1/2 md:-translate-x-1/2
          text-center p-4 flex flex-col gap-[25%] md:flex-row md:gap-6 items-center justify-center md:items-start md:justify-center pointer-events-auto"
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
          animate={!transition ? "visible" : "hidden"}
          className={`text-sm font-medium border-2 transition-colors duration-500 px-4 py-1 mt-2 rounded-lg w-1/2 md:w-auto ${
            activeButton === "info"
              ? "bg-[#C6C1AE] text-[#2E3641] border-[#FFFEF7] hover:text-[#2E3641]"
              : "bg-transparent hover:bg-[#C6C1AE] text-[#FFFEF7] hover:text-[#2E3641] border-[#FFFEF7]"
          } ${isMobile ? "origin-top scale-y-[0.75]" : ""}`}
          onClick={() => handleActionButtonClick("info")}
        >
          Info
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
          animate={!transition ? "visible" : "hidden"}
          className={`text-sm font-medium border-2 transition-colors duration-500 px-4 py-1 mt-2 rounded-lg w-1/2 md:w-auto ${
            activeButton === "mapa"
              ? "bg-[#C6C1AE] text-[#2E3641] border-[#FFFEF7] hover:text-[#2E3641]"
              : "bg-transparent hover:bg-[#C6C1AE] text-[#FFFEF7] hover:text-[#2E3641] border-[#FFFEF7]"
          } ${isMobile ? "origin-top scale-y-[0.75]" : ""}`}
          onClick={() => handleActionButtonClick("mapa")}
        >
          Mapa
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
          animate={!transition ? "visible" : "hidden"}
          className="bg-transparent hover:bg-[#C6C1AE] text-sm font-medium text-[#FFFEF7] hover:text-[#2E3641] border-2 border-[#FFFEF7] transition-colors duration-500 px-4 py-1 mt-2 rounded-lg w-1/2 md:w-auto"
          onClick={handleReturnClick}
        >
          Return
        </motion.button>
      </div>
    </main>
  );
};

export default UI360;
