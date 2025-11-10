import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { themeColors } from '../theme';

interface ResizableSplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
}

const ResizableSplitPane = ({
  left,
  right,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  minRightWidth = 20,
}: ResizableSplitPaneProps) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (
        newLeftWidth >= minLeftWidth &&
        newLeftWidth <= 100 - minRightWidth
      ) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, minLeftWidth, minRightWidth]);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        height: '100%',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: `${leftWidth}%`,
          overflow: 'auto',
          flexShrink: 0,
        }}
      >
        {left}
      </Box>
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          width: 4,
          backgroundColor: `${themeColors.borderLight}80`,
          cursor: 'col-resize',
          flexShrink: 0,
          '&:hover': {
            backgroundColor: themeColors.primary,
          },
          transition: 'background-color 0.2s ease',
          userSelect: 'none',
        }}
      />
      <Box
        sx={{
          width: `${100 - leftWidth}%`,
          overflow: 'auto',
          flexShrink: 0,
        }}
      >
        {right}
      </Box>
    </Box>
  );
};

export default ResizableSplitPane;

