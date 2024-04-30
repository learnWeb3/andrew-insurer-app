import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { useRouter } from "next/router";
import { DevicesDetail } from "./DevicesDetail";
import { VehiclesDetail } from "./VehiclesDetail";
import { ContractDetail } from "./ContractDetail";
import { ContractStatus } from "../../lib/contract-status.enum";
import { useEffect, useState } from "react";
import { UserDetail } from "./UserDetail";
import { ContractStatistics } from "./ContractStatistics";
import { ContractStatusDropdown } from "./ContractStatusDropdown";
import { Contract } from "../../lib/contract.interface";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import {
  findContract,
  findContractDevices,
  findContractVehicles,
} from "../../services/andrew-api.service";
import { PaginatedResults } from "../../lib/paginated-results.interface";
import { DeviceStatus } from "../../lib/device-status.enum";
import { Device } from "../../lib/device.interface";
import { Vehicle } from "../../lib/vehicle.interface";
import { MetricsReportsDetail } from "./MetricsReportsDetail";

export interface ContractsConcernProps {
  id: string | null;
}

export function ContractConcern({ id = null }: ContractsConcernProps) {
  const { accessToken } = useOidcAccessToken();
  const [contract, setContract] = useState<Contract | null>(null);
  const [devices, setDevices] = useState<
    PaginatedResults<{
      id: string;
      ref: {
        label: string;
        href: string;
      };
      status: DeviceStatus;
      vehicle: {
        label: string;
        href: string;
      };
      createdAt: string;
    }>
  >({
    count: 0,
    results: [],
    limit: 10,
    start: 0,
  });
  const [vehicles, setVehicles] = useState<PaginatedResults<Vehicle>>({
    count: 0,
    results: [],
    limit: 10,
    start: 0,
  });
  useEffect(() => {
    if (id && accessToken) {
      findContract(id, accessToken).then((contract: Contract) =>
        setContract(contract)
      );
      findContractDevices(id, accessToken).then((data) => {
        setDevices({
          ...data,
          results: data.results.map((device: Device) => ({
            id: device._id,
            ref: {
              label: device.serialNumber,
              href: `/devices/${device._id}`,
            },
            status: device.status,
            vehicle: {
              label: device.vehicle.vin,
              href: `/vehicles/${device.vehicle._id}`,
            },
            createdAt: device.createdAt,
          })),
        });
      });

      findContractVehicles(id, accessToken).then((data) => {
        setVehicles(data);
      });
    }
  }, [id, accessToken]);
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Breadcrumb
          parts={
            contract
              ? [
                  {
                    label: "Contracts",
                    href: "/contracts",
                  },
                  {
                    label: contract?.ref,
                    href: `/contracts/${contract._id}`,
                  },
                ]
              : [
                  {
                    label: "Contracts",
                    href: "/contracts",
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
          {contract?.ref}
        </Typography>

        <ContractStatusDropdown
          activeItemId={(contract?.status as ContractStatus) || null}
        />
      </Grid>
      <Grid item xs={12}>
        <ContractDetail contract={contract} readOnly={true} />
      </Grid>
      <Grid item xs={12}>
        {vehicles?.results ? (
          <ContractStatistics
            vehiclesVIN={vehicles.results.map((vehicle) => vehicle.vin)}
            from={Date.now() - 365 * 2 * 24 * 60 * 60 * 1000}
          />
        ) : (
          false
        )}
      </Grid>
      <Grid item xs={12}>
        <UserDetail user={contract?.customer || null} />
      </Grid>
      <Grid item xs={12}>
        <VehiclesDetail vehicles={vehicles} readOnly={true} />
      </Grid>
      <Grid item xs={12}>
        <DevicesDetail devices={devices} />
      </Grid>

      {vehicles?.results ? (
        <Grid item xs={12}>
          <MetricsReportsDetail
            vehiclesVIN={vehicles.results.map((vehicle) => vehicle.vin)}
          />
        </Grid>
      ) : (
        false
      )}
    </Grid>
  );
}
