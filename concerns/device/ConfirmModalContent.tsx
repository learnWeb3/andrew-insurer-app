import { Button, Grid, Typography } from "@mui/material";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import DoDisturbOutlinedIcon from "@mui/icons-material/DoDisturbOutlined";
import { TextField } from "../../components/TextField";

export interface ConfirmModalContentProps {
  confirm?: (comment?: string) => void;
  cancel?: () => void;
  label: string;
  description?: string;
  commentable?: boolean;
  comment?: string;
  setComment?: (comment: string) => void;
}

export function ConfirmModalContent({
  confirm = () => {},
  cancel = () => {},
  label = "Please confirm your action",
  description = "",
  commentable = false,
  comment = "",
  setComment = (comment: string) => {},
}: ConfirmModalContentProps) {
  return (
    <Grid
      container
      item
      xs={12}
      spacing={4}
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={12}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {label}
        </Typography>
      </Grid>
      {description ? (
        <Grid item xs={12}>
          <Typography id="modal-modal-title" variant="subtitle1" component="p">
            {description}
          </Typography>
        </Grid>
      ): false}

      {commentable ? (
        <Grid item xs={12}>
          <TextField
            label="Comment"
            textarea={true}
            value={comment || ""}
            handleInput={(value) => setComment(value)}
          />
        </Grid>
      ): false}
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={cancel}
          variant="contained"
          color="error"
          endIcon={<DoDisturbOutlinedIcon />}
        >
          Cancel
        </Button>
        <Button
          onClick={() => confirm(comment)}
          variant="contained"
          endIcon={<ArrowRightAltOutlinedIcon />}
        >
          Confirm
        </Button>
      </Grid>
    </Grid>
  );
}
