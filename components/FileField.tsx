import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export interface FileFieldProps {
  label: string;
}

export function FileField({ label = "Upload file" }: FileFieldProps) {
  return (
    <Button
      component="label"
      variant="outlined"
      startIcon={<CloudUploadIcon />}
    >
      {label}
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}
