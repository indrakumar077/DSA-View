import { createContext, useContext, useState, ReactNode } from 'react';
import { VisualizationControls } from '../../types';

interface VisualizationControlContextType {
  controls: VisualizationControls | null;
  registerControls: (controls: VisualizationControls) => void;
  unregisterControls: () => void;
}

const VisualizationControlContext = createContext<VisualizationControlContextType | undefined>(
  undefined
);

export const VisualizationControlProvider = ({ children }: { children: ReactNode }) => {
  const [controls, setControls] = useState<VisualizationControls | null>(null);

  const registerControls = (newControls: VisualizationControls) => {
    setControls(newControls);
  };

  const unregisterControls = () => {
    setControls(null);
  };

  return (
    <VisualizationControlContext.Provider value={{ controls, registerControls, unregisterControls }}>
      {children}
    </VisualizationControlContext.Provider>
  );
};

export const useVisualizationControls = () => {
  const context = useContext(VisualizationControlContext);
  if (context === undefined) {
    throw new Error('useVisualizationControls must be used within a VisualizationControlProvider');
  }
  return context;
};

