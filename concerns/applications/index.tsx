import { Box, Button, Grid, Hidden, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/Datatable";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import { SearchBar } from "../../components/SearchBar";
import { RenderCellLink } from "../../components/Datatable/RenderCellLink";
import { RenderCellApplicationSatus } from "../../components/Datatable/RenderCellStatus";
import { RenderCellDate } from "../../components/Datatable/RenderCellDate";
import { NewButton } from "../../components/NewButton";
import { ApplicationStatus } from "../../lib/application-status.enum";
import { useEffect, useState } from "react";
import {
  getPendingSubscriptionCount,
  listSubscriptionApplications,
} from "../../services/andrew-api.service";
import { PaginatedResults } from "../../lib/paginated-results.interface";
import { Application } from "../../lib/subscription-application.interface";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { ApplicationStatusFilters } from "./ApplicationStatusFilters";
import { useRouter } from "next/router";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";

export interface ApplicationsConcernProps {
  initialSearchFiltersStatus?: ApplicationStatus;
}

export function ApplicationsConcern({
  initialSearchFiltersStatus = ApplicationStatus.PENDING,
}: ApplicationsConcernProps) {
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

  const { accessToken } = useOidcAccessToken();
  const [subscriptionApplications, setSubscriptionApplications] = useState<
    PaginatedResults<{
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
    }>
  >({
    count: 0,
    results: [],
    limit: 10,
    start: 0,
  });

  const [
    pendingSubscriptionApplicationsCount,
    setPendingSubscriptionApplicationsCount,
  ] = useState<number>(0);

  const { pagination, setPagination } = usePagination(10, 1);

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 400);

  const [searchFilters, setSearchFilters] = useState<{
    status: ApplicationStatus;
  }>({
    status: initialSearchFiltersStatus,
  });

  useEffect(() => {
    if (accessToken) {
      getPendingSubscriptionCount(accessToken).then((count) =>
        setPendingSubscriptionApplicationsCount(count)
      );
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && pagination) {
      console.log(pagination);
      listSubscriptionApplications(
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
        setSubscriptionApplications({
          ...data,
          results: data.results.map((subscriptionApplication: Application) => ({
            id: subscriptionApplication._id,
            ref: {
              label: subscriptionApplication.ref,
              href: `/applications/${subscriptionApplication._id}`,
            },
            user: {
              label: `${subscriptionApplication.customer.fullName}`,
              href: `/users/${subscriptionApplication.customer._id}`,
            },
            status: subscriptionApplication.status,
            createdAt: subscriptionApplication.createdAt,
          })),
        });
      });
    }
  }, [accessToken, searchFilters.status, pagination, debouncedSearchValue]);

  const router = useRouter();

  function handleNewSubscriptionApplication() {
    router.push(`/applications/new`);
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h2" gutterBottom>
          Applications
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <SearchBar
            label="Search subscription applications by reference"
            value={searchValue}
            setValue={setSearchValue}
          />
          <ApplicationStatusFilters
            selectedApplicationStatus={searchFilters.status}
            setSelectedApplicationStatus={(status) =>
              setSearchFilters({
                ...searchFilters,
                status,
              })
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <DataTable
          count={subscriptionApplications.count}
          start={subscriptionApplications.start}
          limit={subscriptionApplications.limit}
          rows={subscriptionApplications.results}
          columns={columns}
          onPaginationChange={(newPagination) => {
            setPagination(newPagination);
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
        />
      </Grid>
    </Grid>
  );
}
