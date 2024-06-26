import {
  Button,
  Grid,
  Hidden,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/Datatable";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import { SearchBar } from "../../components/SearchBar";
import { DeviceStatus } from "../../lib/device-status.enum";
import { RenderCellDate } from "../../components/Datatable/RenderCellDate";
import { RenderCellLink } from "../../components/Datatable/RenderCellLink";
import { RenderCellDeviceSatus } from "../../components/Datatable/RenderCellStatus";
import { NewButton } from "../../components/NewButton";
import { useToggledState } from "../../hooks/useToggledState";
import { ModalWrapper } from "../../components/ModalWrapper";
import { CreateDeviceModalContent } from "../device/CreateDeviceModalContent";
import { useEffect, useState } from "react";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { PaginatedResults } from "../../lib/paginated-results.interface";
import { listDevices } from "../../services/andrew-api.service";
import { Device } from "../../lib/device.interface";
import { OidcRoleGuard } from "../../components/OidcRoleGuard";
import { AvailableRoles } from "../../lib/available-roles.enum";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import { DeviceStatusFilters } from "./DeviceStatusFilters";
import { useRouter } from "next/router";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import { DevicesCardsList } from "./DevicesCardsList";

export interface DevicesConcernProps {
  searchFilters: {
    status: DeviceStatus;
  };
  setSearchFilters: (searchFilters: { status: DeviceStatus }) => void;
}

export function DevicesConcern({
  searchFilters = { status: DeviceStatus.PAIRED },
  setSearchFilters = (newFilters) => {},
}: DevicesConcernProps) {
  const columns: GridColDef[] = [
    {
      field: "reference",
      headerName: "Ref",
      flex: 1.5,
      renderCell: RenderCellLink,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: RenderCellDeviceSatus,
    },
    {
      field: "vehicle",
      headerName: "Vehicle",
      flex: 1.5,
      renderCell: RenderCellLink,
    },
    {
      field: "createdAt",
      headerName: "Created at",
      flex: 1,
      renderCell: RenderCellDate,
    },
  ];

  const router = useRouter();

  const { toggled, open, close } = useToggledState(false);

  const { accessToken } = useOidcAccessToken();

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 400);

  const [devices, setDevices] = useState<
    PaginatedResults<{
      id: string;
      reference: {
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

  const { pagination, setPagination } = usePagination(10, 1);

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
          results: data.results.map((device: Device) => ({
            id: device._id,
            reference: {
              label: device.serialNumber,
              href: `/devices/${device._id}`,
            },
            status: device.status,
            vehicle: device?.vehicle
              ? {
                  label: device.vehicle.vin,
                  href: `/vehicles/${device.vehicle._id}`,
                }
              : {
                  label: "No vehicle attached",
                  href: null,
                },
            createdAt: device.createdAt,
          })),
        });
      });
    }
  }, [accessToken, pagination, debouncedSearchValue, searchFilters]);

  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Grid container spacing={2}>
      <Grid item xs={8} display={"flex"} alignItems={"center"} gap={1}>
        <DevicesOutlinedIcon color="inherit" />
        <Typography variant="h6" component="h2">
          Devices
        </Typography>
      </Grid>

      <OidcRoleGuard
        hasAccessRoles={[AvailableRoles.SUPERADMIN]}
        UnauthorizedComponent={() => null}
      >
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Hidden mdUp>
            <NewButton onClick={open} />
          </Hidden>
          <Hidden lgDown>
            <Button
              onClick={open}
              variant="contained"
              endIcon={<ArrowRightAltOutlinedIcon />}
            >
              Create device
            </Button>
          </Hidden>
        </Grid>
      </OidcRoleGuard>
      <Grid item xs={12}>
        <SearchBar
          label="Search devices by reference"
          value={searchValue}
          setValue={setSearchValue}
        />
      </Grid>
      <Grid item xs={12}>
        <DeviceStatusFilters
          selectedDeviceStatus={searchFilters.status}
          setSelectedDeviceStatus={(status) => {
            const searchFiltersInitialStatusQueryParamKey = "status";
            router.push(
              `/devices?${searchFiltersInitialStatusQueryParamKey}=${status}`
            );
          }}
        />
      </Grid>
      <Grid item xs={12}>
        {matches ? (
          <DataTable
            count={devices.count}
            start={devices.start}
            limit={devices.limit}
            rows={devices.results}
            columns={columns}
            onPaginationChange={(newPagination) => {
              setPagination(newPagination);
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
          />
        ) : (
          <Stack gap={4}>
            <DevicesCardsList rows={devices?.results || []} />
            {devices.count ? (
              <Pagination
                size="large"
                sx={{ mb: 4 }}
                count={Math.ceil(devices.count / pagination.pageSize)}
                page={pagination.page}
                onChange={(
                  event: React.ChangeEvent<unknown>,
                  value: number
                ) => {
                  setPagination({ ...pagination, page: value });
                }}
              />
            ) : (
              false
            )}
          </Stack>
        )}
      </Grid>

      <ModalWrapper
        toggled={toggled}
        close={close}
        content={
          <CreateDeviceModalContent
            close={close}
            refresh={async () => {
              setSearchFilters({
                status: DeviceStatus.INACTIVE,
              });
            }}
          />
        }
      />
    </Grid>
  );
}
