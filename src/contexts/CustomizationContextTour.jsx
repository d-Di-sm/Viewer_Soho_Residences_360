import { createContext, useContext, useState } from "react";

const TourCustomizationContext = createContext({});

export const TourModes = {
  INFO: "INFO",
  VIEW: "VIEW",
  RETURN: "RETURN",
};

export const TourCustomizationProvider = ({ children }) => {
  const [tourMode, setTourMode] = useState(TourModes.VIEW);
  const [isModalPanelActive, setIsModalPanelActive] = useState(false);

  //Function to check if an annotation should be visible
  const isAnnotationVisible = (annotationName) => {
    if (tourMode === TourModes.VIEW) {
      return true;
    }
    return tourMode === annotationName;
  };

  return (
    <TourCustomizationContext.Provider
      value={{
        tourMode,
        setTourMode,

        isModalPanelActive,
        setIsModalPanelActive,

        isAnnotationVisible,
      }}
    >
      {children}
    </TourCustomizationContext.Provider>
  );
};

export const useTourCustomization = () => {
  return useContext(TourCustomizationContext);
};
