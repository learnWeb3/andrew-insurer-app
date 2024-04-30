import { Grid } from "@mui/material";
import { MetricPanel } from "../../components/MetricPanel";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { useEffect, useState } from "react";
import {
  getPendingSubscriptionCount,
  listContracts,
  listDevices,
  listUsers,
  listVehicles,
} from "../../services/andrew-api.service";
import { DeviceStatus } from "../../lib/device-status.enum";
import { ContractStatus } from "../../lib/contract-status.enum";
import dynamic from "next/dynamic";
import { getVehiclesMetricsReportsCount } from "../../services/opensearch-api.service";

export const GaugeChart = dynamic(
  () =>
    import("../../components/ApexChart").then((module) => module.GaugeChart),
  {
    ssr: false,
  }
);

export function BusinessMetrics() {
  const { accessToken } = useOidcAccessToken();

  const [
    pendingSubscriptionApplicationsCount,
    setPendingSubscriptionApplicationsCount,
  ] = useState<number>(0);

  const [metricsReportsCount, setMetricsReportsCount] = useState<number>(0);
  const [usersAccountCount, setUsersAccountCount] = useState<number>(0);
  const [pairedDevicesCount, setPairedDevicesCount] = useState<number>(0);
  const [activeContractsCount, setActiveContractsCount] = useState<number>(0);
  const [registeredVehiclesCount, setRegisteredVehiclesCount] =
    useState<number>(0);

  useEffect(() => {
    if (accessToken) {
      getVehiclesMetricsReportsCount(accessToken).then((count) =>
        setMetricsReportsCount(count)
      );
      getPendingSubscriptionCount(accessToken).then((count) =>
        setPendingSubscriptionApplicationsCount(count)
      );
      listUsers(accessToken, {
        start: 0,
        limit: 1,
      }).then(({ count }) => setUsersAccountCount(count));
      listDevices(accessToken, DeviceStatus.PAIRED, {
        start: 0,
        limit: 1,
      }).then(({ count }) => setPairedDevicesCount(count));
      listContracts(accessToken, ContractStatus.ACTIVE, {
        start: 0,
        limit: 1,
      }).then(({ count }) => setActiveContractsCount(count));
      listVehicles(accessToken, {
        start: 0,
        limit: 1,
      }).then(({ count }) => setRegisteredVehiclesCount(count));
    }
  }, [accessToken]);

  return (
    <Grid item xs={12} lg={12} container spacing={4} alignItems="flex-start">
      <Grid item xs={12} lg={4}>
        <MetricPanel
          label="Pending applications"
          value={pendingSubscriptionApplicationsCount.toFixed(1)}
          href="/applications?status=PENDING"
          icon={
            <FolderOutlinedIcon
              color="inherit"
              sx={{
                width: "2.5rem",
                height: "2.5rem",
              }}
            />
          }
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <MetricPanel
          label="User account"
          value={usersAccountCount.toFixed(1)}
          href="/users"
          icon={
            <PeopleOutlineOutlinedIcon
              color="inherit"
              sx={{
                width: "2.5rem",
                height: "2.5rem",
              }}
            />
          }
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <MetricPanel
          label="Active contracts"
          value={activeContractsCount.toFixed(1)}
          href="/contracts?status=ACTIVE"
          icon={
            <DescriptionOutlinedIcon
              color="inherit"
              sx={{
                width: "2.5rem",
                height: "2.5rem",
              }}
            />
          }
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <MetricPanel
          label="Paired devices"
          value={pairedDevicesCount.toFixed(1)}
          href="/devices?status=PAIRED"
          icon={
            <DevicesOutlinedIcon
              color="inherit"
              sx={{
                width: "2.5rem",
                height: "2.5rem",
              }}
            />
          }
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <MetricPanel
          label="Registered vehicles"
          value={registeredVehiclesCount.toFixed(1)}
          icon={
            <DirectionsCarFilledOutlinedIcon
              color="inherit"
              sx={{
                width: "2.5rem",
                height: "2.5rem",
              }}
            />
          }
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <MetricPanel
          label="Metrics reports"
          value={metricsReportsCount.toFixed(1)}
          icon={
            <EqualizerOutlinedIcon
              color="inherit"
              sx={{
                width: "2.5rem",
                height: "2.5rem",
              }}
            />
          }
        />
      </Grid>
    </Grid>
  );
}
