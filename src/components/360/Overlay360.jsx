import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import "../Overlay.css";
import {
  TourModes,
  useTourCustomization,
} from "../../contexts/CustomizationContextTour";
import { isMobileAtom } from "../UI";

const Overlay360 = ({
  panelImage = "/Im01.png",
  panelTitle = "Panel de Información",
}) => {
  const [showModalPanel, setShowModalPanel] = useState(false);
  // const [panelImage, setPanelImage] = useState('/Im01.png')
  // const [panelTitle, setPanelTitle] = useState('Prueba')
  const { tourMode, setTourMode, setIsModalPanelActive } =
    useTourCustomization();
  const [isMobile] = useAtom(isMobileAtom);

  //Listen for custom events from Experience component
  // useEffect(() => {
  //     const handleAnnotationClick = (event) => {
  //         const { image, annotation } = event.detail
  //         setPanelImage(`/${image}`)
  //         setPanelTitle(annotation)
  //         setShowModalPanel(true)
  //         setIsModalPanelActive(true)
  //     }

  //     window.addEventListener('annotation-click', handleAnnotationClick)

  //     return () => {
  //         window.removeEventListener('annotation-click', handleAnnotationClick)
  //     }

  // }, [setIsModalPanelActive])

  useEffect(() => {
    if (tourMode === TourModes.INFO) {
      setIsModalPanelActive(true);
      setShowModalPanel(true);
    }
  }, [tourMode]);

  // const openModalPanel = () => {
  //     setShowModalPanel(true)
  // }

  const closeModalPanel = () => {
    setShowModalPanel(false);
    setIsModalPanelActive(false);
    setTourMode(TourModes.TOUR);
  };

  return (
    <>
      {/* ----------------------- */}
      {/* Modal Panel con mismo estilo que Overlay.jsx */}
      {createPortal(
        <AnimatePresence>
          {showModalPanel && (
            <>
              {/* Overlay de fondo - por encima del floating panel 360 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100001]"
                onClick={closeModalPanel}
              />

              {/* Modal Panel centrado - mismo estilo que Overlay.jsx */}
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

export default Overlay360;
