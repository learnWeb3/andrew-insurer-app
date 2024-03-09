import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import { TextField } from "../../components/TextField";
import ToggleSwitch from "../../components/ToggleSwitch";
import { useState } from "react";
import { CopyToClipboardIconButton } from "../../components/CopyToClipboardIconButton";

export interface DeviceCredentialsModalcontentProps {
  id: string | null;
  secret: string | null;
  close: () => void;
}

export function DeviceCredentialsModalcontent({
  id,
  secret,
  close = () => {},
}: DeviceCredentialsModalcontentProps) {
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <Grid
      container
      item
      xs={12}
      spacing={2}
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={12}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Device credentials
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="error">
          <AlertTitle>Warning</AlertTitle>
          <ul>
            <li>
              For security reasons these data will be displayed only once.
            </li>
            <li>
              Device ID refers to your Andrew OBD device client ID for data
              transmission.
            </li>
            <li>
              Device SECRET refers to your Andrew OBD device client secret for
              data transmission.
            </li>
            <li>
              Please make sure you have a copy of these informations before
              closing the window.
            </li>
          </ul>
        </Alert>
      </Grid>
      <Grid
        item
        xs={12}
        container
        gap={2}
        alignContent={"flex-start"}
        sx={{
          height: {
            md: "50vh",
          },
          overflow: "auto",
        }}
      >
        <Grid item xs={12} display={"flex"} alignItems={"flex-start"} gap={2}>
          <TextField
            label="Device ID"
            value={id || ""}
            endComponent={
              <CopyToClipboardIconButton
                text={id || ""}
                successMessage={`Device ID copied to clipboard with success.`}
              />
            }
          />
        </Grid>
        <Grid item xs={12} display={"flex"} alignItems={"flex-start"} gap={2}>
          <TextField
            label="Device SECRET"
            value={secret || ""}
            endComponent={
              <CopyToClipboardIconButton
                text={secret || ""}
                successMessage={`Device SECRET copied to clipboard with success.`}
              />
            }
          />
        </Grid>
        <Grid item xs={12} display={"flex"} alignItems={"flex-start"} gap={2}>
          <ToggleSwitch
            label="I have copied and saved the informations displayed on the page."
            checked={checked}
            handleInput={setChecked}
          />
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={close}
          variant="contained"
          size="large"
          disabled={!checked}
          endIcon={<ArrowRightAltOutlinedIcon />}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );
}
