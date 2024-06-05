import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { errorToast, successToast } from "../lib/toast.helpers";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useEffect, useState } from "react";
import { PaginatedResults } from "../lib/paginated-results.interface";
import { DeviceStatus } from "../lib/device-status.enum";
import { usePagination } from "../hooks/usePagination";
import {
  linkDeviceToVehicle,
  listDevices,
} from "../services/andrew-api.service";
import { useDebounce } from "../hooks/useDebounce";
import { Device } from "../lib/device.interface";
import { DeviceDetail } from "../concerns/device/DeviceDetail";

export interface LinkDeviceToVehicleModalContentProps {
  close?: () => void;
  refresh?: () => Promise<void>;
  vehicleId: string | null;
  customerId: string | null;
  contractId: string | null;
}

export function LinkDeviceToVehicleModalContent({
  vehicleId,
  customerId,
  contractId,
  close = () => {},
  refresh = async () => {},
}: LinkDeviceToVehicleModalContentProps) {
  const [searchFilters, setSearchFilters] = useState<{
    status: DeviceStatus;
  }>({
    status: DeviceStatus.INACTIVE,
  });

  const { accessToken } = useOidcAccessToken();

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 400);

  const [devices, setDevices] = useState<PaginatedResults<Device>>({
    count: 0,
    results: [],
    limit: 10,
    start: 0,
  });

  const { pagination, setPagination } = usePagination(10, 1);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    console.log(vehicleId, contractId, customerId);
  }, [vehicleId, contractId, customerId]);

  useEffect(() => {
    if (accessToken && pagination) {
      listDevices(
        accessToken,
        searchFilters.status,
        {
          start: (pagination.page - 1) * pagination.pageSize,
          limit: pagination.pageSize,
        },
        {
          value: debouncedSearchValue,
        }
      ).then((data) => {
        setDevices({
          ...data,
        });
      });
    }
  }, [accessToken, pagination, debouncedSearchValue, searchFilters]);

  async function handleSubmit() {
    if (selectedDevice && vehicleId && customerId && contractId) {
      try {
        successToast(`success linking the device`);
        await linkDeviceToVehicle(accessToken, selectedDevice._id, {
          vehicle: vehicleId,
          customer: customerId,
          contract: contractId,
        });
        await refresh();
      } catch (error) {
        console.log(error);
        errorToast(
          `error linking the device, please retry again later or contact support`
        );
      }
    }
  }

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
          Link a device to the vehicle
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="error">
          <AlertTitle>Warning</AlertTitle>
          <ul>
            <li>
              Linking the device to the vehicle will enable data transmissions.
            </li>
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
          <Autocomplete
            value={searchValue}
            fullWidth={true}
            onChange={(event: any, newValue: string | null) => {
              setSearchValue(newValue || "");
            }}
            inputValue={selectedDevice?.serialNumber}
            onInputChange={(event, newInputValue) => {
              setSelectedDevice(
                devices.results.find(
                  (device) => device.serialNumber === newInputValue
                ) || null
              );
            }}
            id="autocomplete"
            options={devices.results.map((device) => device.serialNumber)}
            renderInput={(params) => (
              <TextField {...params} label={"Select an inactive device"} />
            )}
          />
        </Grid>

        {selectedDevice ? (
          <Grid item xs={12}>
            <DeviceDetail label="Selected device" device={selectedDevice} />
          </Grid>
        ) : (
          false
        )}
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
          disabled={!selectedDevice}
          startIcon={<SettingsOutlinedIcon />}
        >
          Link the device
        </Button>
      </Grid>
    </Grid>
  );
}
