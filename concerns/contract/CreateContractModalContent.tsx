import { Button, Grid, Typography } from "@mui/material";
import AutocompleField from "../../components/AutocompleteField";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import { validateRequired } from "../../components/TextField/validators";
import { TextField } from "../../components/TextField";

export interface CreateContractModalContentProps {
  close?: () => void;
}

export function CreateContractModalContent({
  close = () => {},
}: CreateContractModalContentProps) {
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
        <Typography variant="h5" component="h2">
          Create a contract
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField label="Reference" validate={validateRequired} />
      </Grid>

      <Grid item xs={12}>
        <AutocompleField label="Select a user" />
      </Grid>

      <Grid item xs={12}>
        <AutocompleField
          label="Payment due day"
          options={[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ]}
        />
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
          onClick={() => {}}
          variant="contained"
          endIcon={<ArrowRightAltOutlinedIcon />}
        >
          Create
        </Button>
      </Grid>
    </Grid>
  );
}
