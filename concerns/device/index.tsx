import { Grid, Typography } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { useEffect, useState } from "react";
import { DeviceStatus } from "../../lib/device-status.enum";
import { DeviceDetail } from "./DeviceDetail";
import { DeviceStatistics } from "./DeviceStatistics";
import { DeviceStatusDropdown } from "./DeviceStatusDropdown";
import { Device } from "../../lib/device.interface";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { findDevice } from "../../services/andrew-api.service";
import { VehicleInformations } from "../../components/VehicleInformations";

export interface DeviceConcernProps {
  id: string | null;
}

export function DeviceConcern({ id = null }: DeviceConcernProps) {
  const { accessToken } = useOidcAccessToken();
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    if (id && accessToken) {
      findDevice(id, accessToken).then((device: Device) => setDevice(device));
    }
  }, [id, accessToken]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Breadcrumb
          parts={
            device
              ? [
                  {
                    label: "Devices",
                    href: "/devices",
                  },
                  {
                    label: device?.serialNumber as string,
                    href: `/devices/${device?._id}`,
                  },
                ]
              : [
                  {
                    label: "Devices",
                    href: "/devices",
                  },
                ]
          }
        />
      </Grid>
      <Grid
        item
        xs={12}
        lg={9}
        sx={{ display: "flex", alignItems: "center", gap: 4 }}
      >
        <Typography variant="h4" component="h2">
          {device?.serialNumber}
        </Typography>

        <DeviceStatusDropdown
          activeItemId={(device?.status as DeviceStatus) || null}
        />
      </Grid>
      <Grid item xs={12}>
        <DeviceStatistics />
      </Grid>
      <Grid item xs={12}>
        <DeviceDetail device={device} />
      </Grid>
      <Grid item xs={12}>
        {device ? (
          <VehicleInformations readOnly={true} vehicle={device.vehicle} />
        ) : (
          false
        )}
      </Grid>
    </Grid>
  );
}
