import { Grid, Typography } from "@mui/material";
import { DateField } from "../../components/DateField";
import { Device } from "../../lib/device.interface";
import { validateRequired } from "../../components/TextField/validators";

export interface DeviceDetailProps {
  device: Device | null;
}

export function DeviceDetail({ device = null }: DeviceDetailProps) {
  return (
    <Grid container item xs={12} spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h6" component="h2" gutterBottom>
          Device
        </Typography>
      </Grid>
      {device ? (
        <Grid item xs={12}>
          <DateField
            label="Pairing date"
            value={device.pairingDate}
            validate={validateRequired}
            errors={[]}
            setErrors={() => {}}
            handleInput={() => {}}
          />
        </Grid>
      ): false}
      {device ? (
        <Grid item xs={12}>
          <DateField
            label="Registration date"
            value={device.createdAt}
            validate={validateRequired}
            errors={[]}
            setErrors={() => {}}
            handleInput={() => {}}
          />
        </Grid>
      ): false}
    </Grid>
  );
}
