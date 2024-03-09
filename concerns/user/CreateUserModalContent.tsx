import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Typography,
} from "@mui/material";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import ToggleSwitch from "../../components/ToggleSwitch";
import { TextField } from "../../components/TextField";
import {
  validateEmail,
  validateRequired,
} from "../../components/TextField/validators";
import { useEffect, useState } from "react";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { createThirdPartyUser } from "../../services/andrew-api.service";
import { errorToast, successToast } from "../../lib/toast.helpers";
import { useToggledState } from "../../hooks/useToggledState";
import { ModalWrapper } from "../../components/ModalWrapper";
import { CustomerCredentialsModalcontent } from "./CustomerCredentialsModalContent";

export interface CreateUserModalContentProps {
  close?: () => void;
  refresh?: () => Promise<void>;
}

export function CreateUserModalContent({
  close = () => {},
  refresh = async () => {},
}: CreateUserModalContentProps) {
  const { accessToken } = useOidcAccessToken();
  const [insurer, setInsurer] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [errors, setErrors] = useState<{ [field: string]: string[] }>({
    firstName: [],
    lastName: [],
    email: [],
  });

  const {
    toggled: credentialsToggled,
    open: credentialsOpen,
    close: credentialsClose,
  } = useToggledState(false);
  const [credentials, setCredentials] = useState<{
    password: string;
  } | null>(null);

  async function handleSubmit() {
    try {
      const { _id, password } = await createThirdPartyUser(accessToken, {
        email,
        firstName,
        lastName,
        insurer,
      });
      successToast(`success creating the account`);
      await refresh();
      setCredentials({
        password,
      });
    } catch (error) {
      console.log(error);
      errorToast(
        `error creating the account, please retry again later or contact support`
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
          Create customer/insurer account
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="error">
          <AlertTitle>Warning</AlertTitle>
          <ul>
            <li>
              A password will be generated and displayed upon form submission.
            </li>
            <li>
              For security reasons this password will be displayed only once.
            </li>
            <li>A reset password email will be sent to the user email.</li>
            <li>
              To test the account please open a new private window and log in
              with the user credentials.
            </li>
            {insurer ? (
              <li>
                Insurer has priviledged access to customers data, before
                submitting be sure you need want to enable this option.
              </li>
            ) : (
              false
            )}
          </ul>
        </Alert>
      </Grid>
      <Grid
        item
        container
        xs={12}
        gap={2}
        sx={{
          height: {
            md: "42vh",
          },
          overflow: "auto",
        }}
      >
        <Grid item xs={12}>
          <TextField
            label="Email"
            validate={validateEmail}
            errors={errors.email}
            value={email}
            setErrors={(errors) =>
              setErrors((state) => ({
                ...state,
                email: errors,
              }))
            }
            handleInput={setEmail}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Firstname"
            validate={validateRequired}
            errors={errors.firstName}
            value={firstName}
            setErrors={(errors) =>
              setErrors((state) => ({
                ...state,
                firstName: errors,
              }))
            }
            handleInput={setFirstName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Lastname"
            validate={validateRequired}
            errors={errors.lastName}
            value={lastName}
            setErrors={(errors) =>
              setErrors((state) => ({
                ...state,
                lastName: errors,
              }))
            }
            handleInput={setLastName}
          />
        </Grid>
        <Grid item xs={12}>
          <ToggleSwitch
            label="Insurer ?"
            handleInput={setInsurer}
            checked={insurer}
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
          onClick={handleSubmit}
          variant="contained"
          disabled={
            errors.firstName.length ||
            errors.lastName.length ||
            errors.email.length
              ? true
              : false
          }
          endIcon={<ArrowRightAltOutlinedIcon />}
        >
          Create
        </Button>
      </Grid>
      <ModalWrapper
        toggled={credentialsToggled}
        close={credentialsClose}
        content={
          <CustomerCredentialsModalcontent
            password={credentials?.password || null}
            email={email}
            close={close}
          />
        }
      />
    </Grid>
  );
}
