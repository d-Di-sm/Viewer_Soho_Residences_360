import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Overlay.css";
import { Button } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { atom, useAtom } from "jotai";
import { isMobileAtom } from "./UI";

// Mapping de objetos a imagenes y titulos
const objectMappings = {
  "2BR_G_A": {
    image: "./FP/2BR_A.jpg",
    title: "2 Bedrooms A Garden: 211.54 sqm",
  },
  "2BR_N1_A": {
    image: "./FP/2BR_A.jpg",
    title: "2 Bedrooms A L1: 211.54.00 sqm",
  },
  "2BR_N2_A": {
    image: "./FP/2BR_A.jpg",
    title: "2 Bedrooms A L2: 211.54.00 sqm",
  },
  "3BR_G_A": {
    image: "./FP/3BR_A.jpg",
    title: "3 Bedrooms A Garden: 215.71 sqm",
  },
  "3BR_N1_A": { image: "./FP/3BR_A.jpg", title: "3 Bedrooms A L1: 215.71 sqm" },
  "3BR_N2_A": { image: "./FP/3BR_A.jpg", title: "3 Bedrooms A L2: 215.71 sqm" },
  "4BR_A": { image: "./FP/4BR_A.jpg", title: "4 Bedrooms A: 428.86 sqm" },

  "2BR_G_B": {
    image: "./FP/2BR_B.jpg",
    title: "2 Bedrooms B Garden: 211.54 sqm",
  },
  "2BR_N1_B": {
    image: "./FP/2BR_B.jpg",
    title: "2 Bedrooms B L1: 211.54.00 sqm",
  },
  "2BR_N2_B": {
    image: "./FP/2BR_B.jpg",
    title: "2 Bedrooms B L2: 211.54.00 sqm",
  },
  "3BR_G_B": {
    image: "./FP/3BR_B.jpg",
    title: "3 Bedrooms B Garden: 215.71 sqm",
  },
  "3BR_N1_B": { image: "./FP/3BR_B.jpg", title: "3 Bedrooms B L1: 215.71 sqm" },
  "3BR_N2_B": { image: "./FP/3BR_B.jpg", title: "3 Bedrooms B L2: 215.71 sqm" },
  "4BR_B": { image: "./FP/4BR_B.jpg", title: "4 Bedrooms B: 428.86 sqm" },

  CA_01: { image: "./FP/C_A1.jpg", title: "The Casita A1: 380.95 sqm" },
};

export const floatingPanelActive = atom(false);
export const modalPanelActive = atom(false);

const Overlay = () => {
  const [showFloatingPanel, setShowFloatingPanel] = useState(false);
  const [showModalPanel, setShowModalPanel] = useState(false);
  const [panelImage, setPanelImage] = useState("/logotipo.png");
  const [panelTitle, setPanelTitle] = useState("Informacion del proyecto");
  const [panelDescription, setPanelDescription] = useState("");
  const [tourButtonEnabled, setTourButtonEnabled] = useState(false);
  const [currentTourKey, setCurrentTourKey] = useState(null);

  const [isFloatingPanelActive, setIsFloatingPanelActive] =
    useAtom(floatingPanelActive);
  const [isModalPanelActive, setIsModalPanelActive] = useAtom(modalPanelActive);
  const [isMobile] = useAtom(isMobileAtom);

  useEffect(() => {
    const openPanel = (
      image,
      annotation,
      description = "",
      enableTour = false,
      tourKey = null,
    ) => {
      setPanelImage(`/${image}`);
      setPanelTitle(annotation);
      setPanelDescription(description);
      setTourButtonEnabled(enableTour);
      setCurrentTourKey(tourKey);
      setShowFloatingPanel(true);
      setIsFloatingPanelActive(true);
    };

    const handleAnnotationClick = (event) => {
      const { image, annotation, description, section } = event.detail;
      const tourKey = section === "casita" ? "CA_01" : null;
      openPanel(
        image,
        annotation,
        description ?? "",
        section === "casita",
        tourKey,
      );
    };

    const handleMeshClick = (event) => {
      const { image, annotation, description, meshName } = event.detail;
      openPanel(image, annotation, description ?? "", true, meshName ?? null);
    };

    window.addEventListener("annotation-click", handleAnnotationClick);
    window.addEventListener("mesh-click", handleMeshClick);

    return () => {
      window.removeEventListener("annotation-click", handleAnnotationClick);
      window.removeEventListener("mesh-click", handleMeshClick);
    };
  }, [setIsFloatingPanelActive]);

  //Listen for return from 360 tour
  // useEffect(() => {
  //     const handleReturnFrom360 = (event) => {
  //         const { meshName } = event.detail

  //         if (meshName === 'CA_01' && lastPanelState) {
  //             setCameraMode(CameraModes.CASITA)
  //             setTipologyResidencias(lastPanelState.tipologies || [])
  //             setPanelImage(`/${lastPanelState.image}`)
  //             setPanelTitle(lastPanelState.title)
  //             setCurrentMeshName(lastPanelState.meshName)
  //             setShowFloatingPanel(true)
  //             setIsFloatingPanelActive(true)
  //             return
  //         }

  //         // Set camera mode to RESIDENCES
  //         setCameraMode(CameraModes.RESIDENCES)

  //         // Activate the tipology for the returned mesh
  //         setTipologyResidencias([meshName])

  //         const mapping = objectMappings[meshName]
  //         if (mapping) {
  //             setPanelImage(`/${mapping.image}`)
  //             setPanelTitle(mapping.title)
  //             setCurrentMeshName(meshName)
  //             setShowFloatingPanel(true)
  //             setIsFloatingPanelActive(true)
  //         }
  //     }

  //     window.addEventListener('return-from-360', handleReturnFrom360)

  //     return () => {
  //         window.removeEventListener('return-from-360', handleReturnFrom360)
  //     }

  // }, [lastPanelState, setCameraMode, setIsFloatingPanelActive, setTipologyResidencias])

  const closeFloatingPanel = () => {
    setShowFloatingPanel(false);
    setPanelImage("/logotipo.png");
    setPanelTitle("Informacion del proyecto");
    setTourButtonEnabled(false);
    setCurrentTourKey(null);
    setIsFloatingPanelActive(false);
  };

  const openModalPanel = (e) => {
    e.stopPropagation(); // Prevenir que se cierre el floating panel
    setShowModalPanel(true);

    setIsModalPanelActive(true);
  };

  const closeModalPanel = () => {
    setShowModalPanel(false);

    setIsModalPanelActive(false);
  };

  return (
    <>
      {/* Logotipo del desarrollo */}
      {/* <div className="logo-container">
        <div className="logo-main">
          <img src="/Soho_Logo.png" alt="Soho Logo" />
        </div>
        <img src="/logotipo.png" alt="Logo" className="soho-logo" />
      </div> */}

      {/* <div
        className={`absolute z-10 ${isMobile ? "top-4 left-4" : "top-[50px] left-[50px]"}`}
      >
        <img
          src="/Soho_Logo.png"
          alt="Soho Logo"
          className={isMobile ? "w-16 h-auto" : "w-[100px] h-auto"}
        />
      </div> */}

      {/* ------------------------ */}
      {/* Navigation Words */}
      {/* <div
        style={{
          position: "absolute",
          top: "80px",
          right: "20px",
          display: "flex",
          flexDirection: "row",
          gap: "120px",
          zIndex: 10,
          transform: "translateX(-50px)",
        }}
      >
        <a
          href="https://sordomadaleno.com/projects"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "25px",
            color: "#FFFEF7",
            fontWeight: "500",
            textDecoration: "none",
            cursor: "pointer",
            transition: "opacity 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.opacity = "0.7")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          PROJECTS
        </a>

        <a
          href="http://sordomadaleno.com/studio"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "25px",
            color: "#FFFEF7",
            fontWeight: "500",
            textDecoration: "none",
            cursor: "pointer",
            transition: "opacity 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.opacity = "0.7")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          STUDIO
        </a>

        <span
          style={{
            fontSize: "25px",
            color: "#FFFEF7",
            fontWeight: "500",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.opacity = "0.7")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          TEAM
        </span>

        <span
          style={{
            fontSize: "25px",
            color: "#FFFEF7",
            fontWeight: "500",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.opacity = "0.7")}
          onMouseOut={(e) => (e.target.style.opacity = "1")}
        >
          HOME
        </span>
      </div> */}

      {/* ---------------- */}
      {/*Floating Panel */}
      {/* {showFloatingPanel && (
        <div className="floating-panel">
          <button className="floating-panel-close" onClick={closeFloatingPanel}>
            x
          </button>
          <div className="floating-panel-content">
            <img
              src={panelImage}
              alt={panelTitle}
              className="floating-panel-image"
              onClick={openModalPanel}
              style={{ cursor: "pointer" }}
            />
            <h3 className="floating-panel-title">{panelTitle}</h3>
            <Button
              variant="outline"
              onClick={
                objectMappings[currentMeshName]
                  ? () => onTourClick(currentMeshName)
                  : null
              }
              disabled={!objectMappings[currentMeshName]}
              style={{
                width: "150px",
                marginTop: "10px",
                color: "#FFFEF7",
                borderColor: "rgba(255,254,247,0.5)",
                backgroundColor: objectMappings[currentMeshName]
                  ? "rgba(255,254,247,0.5)"
                  : "rgba(128,128,128,0.3)",
                opacity: objectMappings[currentMeshName] ? 1 : 0.5,
                cursor: objectMappings[currentMeshName]
                  ? "pointer"
                  : "not-allowed",
                "&:hover": {
                  backgroundColor: objectMappings[currentMeshName]
                    ? "rgba(255,254,247,0.6)"
                    : "rgba(128,128,128,0.3)",
                },
              }}
            >
              TOUR
            </Button>
          </div>
        </div>
      )} */}

      {createPortal(
        <AnimatePresence>
          {showFloatingPanel && (
            <>
              {/* Overlay de fondo - por encima de UI */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99998]"
                onClick={closeFloatingPanel}
              />

              {/* Panel deslizable desde la derecha */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 200,
                }}
                className={`fixed top-0 right-0 h-full w-full ${
                  isMobile ? "" : "max-w-[672px]"
                } bg-[#C6C1AE] backdrop-blur-md shadow-2xl z-[100000] flex flex-col`}
                style={{ fontFamily: "OT PIETRO PRO" }}
              >
                {/* Botón de cerrar */}
                <button
                  onClick={closeFloatingPanel}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-2xl font-light text-[#FFFEF7] hover:bg-white/20 rounded-full transition-colors duration-200 z-10"
                >
                  ×
                </button>

                {/* Contenido del panel */}
                <div
                  className="flex flex-col items-center justify-start p-8 pt-16 h-full overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Imagen centrada */}
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    src={panelImage}
                    alt={panelTitle}
                    onClick={openModalPanel}
                    className="w-full max-w-[576px] h-auto rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300 mx-auto mt-[25px]"
                  />

                  {/* Título centrado horizontalmente con la imagen, 50px abajo */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="text-[#FFFEF7] text-xl font-medium text-center mt-[50px] px-4"
                  >
                    {panelTitle}
                  </motion.h3>

                  {/* Sección Description con lorem ipsum */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="mt-6 px-4 w-full"
                  >
                    {/* <h4 className="text-[#FFFEF7] text-lg font-semibold mb-3 text-center">
                      Description
                    </h4> */}
                    <p className="text-[rgba(255,254,247,0.8)] text-base leading-relaxed text-center whitespace-pre-line">
                      {panelDescription || ""}
                    </p>

                    {tourButtonEnabled && (
                      <div className="flex justify-center mt-6">
                        <motion.button
                          type="button"
                          className={`text-sm bg-transparent hover:bg-[#C6C1AE] font-semibold text-[#FFFEF7] hover:text-[#2E3641] border-2 border-[#FFFEF7] transition-colors duration-500 px-4 py-1 rounded-lg uppercase w-auto ${isMobile ? "origin-top scale-y-[0.75]" : ""}`}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            closeFloatingPanel();
                            window.dispatchEvent(
                              new CustomEvent("tour-button-click", {
                                detail: { returnToMesh: currentTourKey },
                              }),
                            );
                          }}
                        >
                          TOUR
                        </motion.button>
                      </div>
                    )}
                  </motion.div>

                  {/* <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Button
                    variant="outline"
                    onClick={
                      objectMappings[currentMeshName]
                        ? () => onTourClick(currentMeshName)
                        : null
                    }
                    disabled={!objectMappings[currentMeshName]}
                    className={`w-[150px] mt-2.5 ${
                      objectMappings[currentMeshName]
                        ? "bg-[rgba(255,254,247,0.5)] text-[#FFFEF7] border-[rgba(255,254,247,0.5)] hover:bg-[rgba(255,254,247,0.6)] cursor-pointer"
                        : "bg-[rgba(128,128,128,0.3)] text-[#FFFEF7] border-[rgba(255,254,247,0.5)] opacity-50 cursor-not-allowed"
                    }`}
                  >
                    TOUR
                  </Button>
                </motion.div> */}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* ----------------------- */}
      {/* Modal Panel */}
      {/* {showModalPanel && (
            <div className="modal-overlay" onClick={closeModalPanel}>
                <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-panel-close" onClick={closeModalPanel}>x</button>
                    <div className="modal-panel-content">
                        <img src={panelImage} alt={panelTitle} className="modal-panel-image" />
                        <h3 className="modal-panel-title">{panelTitle}</h3>
                    </div>
                </div>
            </div>
        )} */}

      {createPortal(
        <AnimatePresence>
          {showModalPanel && (
            <>
              {/* Overlay de fondo - por encima del floating panel */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100001]"
                onClick={closeModalPanel}
              />

              {/* Modal Panel centrado - por encima del floating panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 200,
                }}
                style={{
                  position: "fixed",
                  top: isMobile ? "2.5%" : "10%",
                  left: isMobile ? "2.5%" : "10%",
                  width: isMobile ? "95vw" : "80vw",
                  height: isMobile ? "95vh" : "80vh",
                  zIndex: 100002,
                  fontFamily: "OT PIETRO PRO",
                }}
                className="bg-[#C6C1AE] backdrop-blur-md shadow-2xl flex flex-col rounded-[20px] border-2 border-[rgba(255,254,247,0.8)]"
              >
                {/* Botón de cerrar */}
                <button
                  onClick={closeModalPanel}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-2xl font-light text-[#FFFEF7] hover:bg-white/20 rounded-full transition-colors duration-200 z-10"
                >
                  ×
                </button>

                {/* Contenido del modal - solo imagen y título */}
                <div className="flex flex-col items-center justify-center h-full p-8">
                  {/* Imagen con proporción 16:9 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="w-[80%] max-h-[64vh] aspect-video rounded-lg overflow-hidden shadow-lg"
                  >
                    <img
                      src={panelImage}
                      alt={panelTitle}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </motion.div>

                  {/* Título centrado debajo de la imagen */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-[#FFFEF7] text-2xl font-medium text-center mt-6 px-4"
                  >
                    {panelTitle}
                  </motion.h3>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

export default Overlay;
