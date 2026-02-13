import { Affix, Button } from "@mantine/core";
import { useState } from "react";
import {
  TourModes,
  useTourCustomization,
} from "../contexts/CustomizationContextTour.jsx";

const Interface360 = ({ onReturnClick }) => {
  const { tourMode, setTourMode, isModalPanelActive } = useTourCustomization();
  const [hoveredButton, setHoveredButton] = useState(null);

  const logos = ["L01.png", "L04.png", "L07.png"];

  const handleButtonClick = (mode) => {
    if (mode === "RETURN" && onReturnClick) {
      onReturnClick();
    } else {
      setTourMode(mode);
    }
  };

  // Si el modal panel del 360 está activo, ocultamos la interfaz 360
  if (isModalPanelActive) {
    return null;
  }

  return (
    <>
      <Affix
        position={{ bottom: 50, right: "50%" }}
        style={{ transform: "translateX(50%)" }}
      >
        <div
          style={{
            backgroundColor: "rgba(198, 193, 174, 0.5)",
            borderRadius: "22px",
            padding: "12px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 254, 247, 0.8)",
            display: "flex",
            gap: "4px",
            alignItems: "center",
            position: "relative",
          }}
        >
          {Object.keys(TourModes).map((mode, index) => {
            const isActive = mode === tourMode;

            return (
              <Button
                key={mode}
                size="xs"
                onClick={() => handleButtonClick(mode)}
                onMouseEnter={() => setHoveredButton(mode)}
                onMouseLeave={() => setHoveredButton(null)}
                styles={{
                  root: {
                    backgroundColor: isActive
                      ? "rgba(255, 254, 247, 0.5)"
                      : "transparent",
                    borderRadius: "5px",
                    width: "60px",
                    height: "25px",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255, 254, 247, 0.8)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "rgba(255, 254, 247, 0.6)"
                        : "rgba(255, 254, 247, 0.1)",
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <img
                  src={`/logos/${logos[index]}`}
                  alt={`Logo ${index + 1}`}
                  style={{
                    width: "25px",
                    height: "auto",
                    borderRadius: "4px",
                    objectFit: "cover",
                  }}
                />
              </Button>
            );
          })}
        </div>

        {/* Tooltip */}
        {hoveredButton && (
          <div
            style={{
              position: "absolute",
              bottom: "155px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "transparent",
              color: "#FFFEF7",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "25px",
              fontWeight: "500",
              whiteSpace: "nowrap",
              zIndex: 1000,
            }}
          >
            {hoveredButton}
          </div>
        )}
      </Affix>

      {/* <Affix>
            {tourMode === TourModes.INFO && <TourInformation />}
        </Affix> */}
    </>
  );
};

export default Interface360;
