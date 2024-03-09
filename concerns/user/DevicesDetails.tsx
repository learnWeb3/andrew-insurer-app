import { Grid, Typography } from "@mui/material";
import { SearchBar } from "../../components/SearchBar";
import DataTable from "../../components/Datatable";
import { DeviceStatus } from "../../lib/device-status.enum";
import { RenderCellLink } from "../../components/Datatable/RenderCellLink";
import { RenderCellDeviceSatus } from "../../components/Datatable/RenderCellStatus";
import { GridColDef } from "@mui/x-data-grid";
import { RenderCellDate } from "../../components/Datatable/RenderCellDate";
import { PaginatedResults } from "../../lib/paginated-results.interface";

export interface DevicesDetailProps {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  setPagination: (newPagination: { pageSize: number; page: number }) => void;
  devices: PaginatedResults<{
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
  }>;
}
export function DevicesDetail({
  devices,
  setPagination,
  searchValue,
  setSearchValue,
}: DevicesDetailProps) {
  const columns: GridColDef[] = [
    {
      field: "ref",
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

  return (
    <Grid container item xs={12} spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Devices
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={4}>
        <Grid item xs={12}>
          <SearchBar
            label="Search devices by serial number"
            value={searchValue}
            setValue={setSearchValue}
          />
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </Grid>
  );
}
