import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { themeColors } from '../../../theme';

interface CustomInputField {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

interface CustomInputDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  fields: CustomInputField[];
  submitLabel?: string;
  cancelLabel?: string;
}

export const CustomInputDialog = ({
  open,
  onClose,
  onSubmit,
  title = 'Test with Custom Input',
  fields,
  submitLabel = 'Apply',
  cancelLabel = 'Cancel',
}: CustomInputDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: themeColors.inputBgDark,
          color: themeColors.white,
          minWidth: 400,
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((field, index) => (
          <TextField
            key={index}
            label={field.label}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            fullWidth
            margin="normal"
            placeholder={field.placeholder}
            type={field.type || 'text'}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: themeColors.white,
                '& fieldset': {
                  borderColor: themeColors.borderLight,
                },
                '&:hover fieldset': {
                  borderColor: themeColors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: themeColors.primary,
                },
              },
              '& label': {
                color: themeColors.textSecondary,
              },
              '& label.Mui-focused': {
                color: themeColors.primary,
              },
            }}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: themeColors.white,
            '&:hover': {
              backgroundColor: `${themeColors.white}1a`,
            },
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            backgroundColor: themeColors.primary,
            color: themeColors.textPrimary,
            '&:hover': {
              backgroundColor: `${themeColors.primary}dd`,
            },
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

