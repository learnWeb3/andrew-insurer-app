import { Alert, AlertTitle, Button, Grid, Typography } from "@mui/material";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import { TextField } from "../../components/TextField";
import ToggleSwitch from "../../components/ToggleSwitch";
import { useState } from "react";
import { CopyToClipboardIconButton } from "../../components/CopyToClipboardIconButton";

export interface CustomerCredentialsModalcontentProps {
  password: string | null;
  email: string;
  close: () => void;
}

export function CustomerCredentialsModalcontent({
  password,
  email,
  close = () => {},
}: CustomerCredentialsModalcontentProps) {
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
          Customer credentials
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="error">
          <AlertTitle>Warning</AlertTitle>
          <ul>
            <li>
              For security reasons these data will be displayed only once.
            </li>
            <li>A reset password email has been sent to the user email.</li>
            <li>
              To test the account please open a new private window and log in
              with the user credentials.
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
            md: "43vh",
          },
          overflow: "auto",
        }}
      >
        <Grid item xs={12} display={"flex"} alignItems={"flex-start"} gap={2}>
          <TextField
            label="Email"
            value={email}
            endComponent={
              <CopyToClipboardIconButton
                text={email || ""}
                successMessage={`Email copied to clipboard with success.`}
              />
            }
          />
        </Grid>
        <Grid item xs={12} display={"flex"} alignItems={"flex-start"} gap={2}>
          <TextField
            label="Password"
            value={password || ""}
            endComponent={
              <CopyToClipboardIconButton
                text={password || ""}
                successMessage={`Password copied to clipboard with success.`}
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
