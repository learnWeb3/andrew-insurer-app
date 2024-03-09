import { Grid, Typography } from "@mui/material";
import { SearchBar } from "../../components/SearchBar";
import DataTable from "../../components/Datatable";
import { RenderCellLink } from "../../components/Datatable/RenderCellLink";
import { RenderCellApplicationSatus } from "../../components/Datatable/RenderCellStatus";
import { GridColDef } from "@mui/x-data-grid";
import { RenderCellDate } from "../../components/Datatable/RenderCellDate";
import { PaginatedResults } from "../../lib/paginated-results.interface";
import { ApplicationStatus } from "../../lib/application-status.enum";

export interface SubscriptionApplicationsDetailsProps {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  setPagination: (newPagination: { pageSize: number; page: number }) => void;
  applications: PaginatedResults<{
    id: string;
    ref: {
      label: string;
      href: string;
    };
    user: {
      label: string;
      href: string;
    };
    status: ApplicationStatus;
    createdAt: string;
  }>;
}
export function SubscriptionApplicationsDetails({
  applications,
  setPagination,
  searchValue,
  setSearchValue,
}: SubscriptionApplicationsDetailsProps) {
  const columns: GridColDef[] = [
    {
      field: "ref",
      headerName: "Ref",
      flex: 2,
      renderCell: RenderCellLink,
    },
    {
      field: "user",
      headerName: "User",
      flex: 1,
      renderCell: RenderCellLink,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: RenderCellApplicationSatus,
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
          Applications
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={4}>
        <Grid item xs={12}>
          <SearchBar
            label="Search subscription application by reference"
            value={searchValue}
            setValue={setSearchValue}
          />
        </Grid>
        <Grid item xs={12}>
          <DataTable
            count={applications.count}
            start={applications.start}
            limit={applications.limit}
            rows={applications.results}
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
