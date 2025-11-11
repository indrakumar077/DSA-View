import { SvgIcon, SvgIconProps } from '@mui/material';
import { themeLogos } from '../../config/theme.config';

interface DSALogoIconProps extends SvgIconProps {
  color?: 'primary' | 'white' | 'dark';
}

export const DSALogoIcon = ({ color = 'primary', ...props }: DSALogoIconProps) => {
  const logoColor = themeLogos.colors[color];
  
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none" sx={{ color: logoColor }}>
      <path
        d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21.75l-3.75-1.5L4.5 18v-4.5l3.75 1.5L12 16.5l3.75-1.5L19.5 18v4.5l-3.75 1.5L12 21.75z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};
