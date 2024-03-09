import { Alert, AlertTitle, Button, Grid, Typography } from "@mui/material";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import { TextField } from "../../components/TextField";
import { validateRequired } from "../../components/TextField/validators";
import { createDevice } from "../../services/andrew-api.service";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { useEffect, useState } from "react";
import { errorToast, successToast } from "../../lib/toast.helpers";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { generateSerialNumber } from "../../lib/serial-number-generator.helpers";
import { useToggledState } from "../../hooks/useToggledState";
import { ModalWrapper } from "../../components/ModalWrapper";
import { DeviceCredentialsModalcontent } from "./DeviceCredentialsModalContent";

export interface CreateDeviceModalContentProps {
  close?: () => void;
  refresh?: () => Promise<void>;
}

export function CreateDeviceModalContent({
  close = () => {},
  refresh = async () => {},
}: CreateDeviceModalContentProps) {
  const { accessToken } = useOidcAccessToken();
  const {
    toggled: credentialsToggled,
    open: credentialsOpen,
    close: credentialsClose,
  } = useToggledState(false);
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [credentials, setCredentials] = useState<{
    secret: string;
    id: string;
  } | null>(null);
  async function handleCreateDevice() {
    try {
      const { credentials, device } = await createDevice(accessToken, {
        serialNumber,
      });
      successToast(`success creating the device ${serialNumber}`);
      await refresh();
      setCredentials({
        secret: credentials.value,
        id: device._id,
      });
    } catch (error) {
      console.log(error);
      errorToast(
        `error creating the device ${serialNumber}, please retry again later or contact support`
      );
    }
  }
  useEffect(() => {
    if (credentials) {
      credentialsOpen();
    }
  }, [credentials]);
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
          Create a device
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="error">
          <AlertTitle>Warning</AlertTitle>
          <ul>
            <li>
              Credentials will be generated and displayed upon form submission.
            </li>
            <li>
              For security reasons these data will be displayed only once.
            </li>
            <li>
              Please contact support in case if you have lost credentials.
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
            label="Serial number"
            validate={validateRequired}
            value={serialNumber}
            handleInput={(value) => setSerialNumber(value)}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            title="Generate serial number"
            onClick={() => setSerialNumber(generateSerialNumber(32))}
          >
            <TipsAndUpdatesOutlinedIcon />
          </Button>
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
          onClick={handleCreateDevice}
          variant="contained"
          size="large"
          disabled={!serialNumber}
          endIcon={<ArrowRightAltOutlinedIcon />}
        >
          Create
        </Button>
      </Grid>
      <ModalWrapper
        toggled={credentialsToggled}
        close={credentialsClose}
        content={
          <DeviceCredentialsModalcontent
            id={credentials?.id || null}
            secret={credentials?.secret || null}
            close={close}
          />
        }
      />
    </Grid>
  );
}
