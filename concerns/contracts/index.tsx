import { Grid, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/Datatable";
import { SearchBar } from "../../components/SearchBar";
import { RenderCellLink } from "../../components/Datatable/RenderCellLink";
import { RenderCellContractSatus } from "../../components/Datatable/RenderCellStatus";
import { RenderCellDate } from "../../components/Datatable/RenderCellDate";
import { ContractStatus } from "../../lib/contract-status.enum";
import { useEffect, useState } from "react";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { PaginatedResults } from "../../lib/paginated-results.interface";
import { listContracts } from "../../services/andrew-api.service";
import { Contract } from "../../lib/contract.interface";
import { ContractStatusFilters } from "./ContractStatusFilters";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import { useRouter } from "next/router";

export interface ContractsConcernProps {
  searchFilters: {
    status: ContractStatus;
  };
  setSearchFilters: (searchFilters: { status: ContractStatus }) => void;
}

export function ContractsConcern({
  searchFilters = { status: ContractStatus.ACTIVE },
  setSearchFilters = (newFilters) => {},
}: ContractsConcernProps) {
  const router = useRouter();
  const columns: GridColDef[] = [
    {
      field: "ref",
      headerName: "Ref",
      flex: 1,
      renderCell: RenderCellLink,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: RenderCellContractSatus,
    },
    {
      field: "vehicle",
      headerName: "Vehicle count",
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

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 400);
  const { accessToken } = useOidcAccessToken();

  const [contracts, setContracts] = useState<
    PaginatedResults<{
      id: string;
      ref: {
        label: string;
        href: string;
      };
      status: ContractStatus;
      vehicle: {
        label: number;
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
      listContracts(
        accessToken,
        searchFilters?.status,
        {
          start: (pagination.page - 1) * pagination.pageSize,
          limit: pagination.pageSize,
        },
        {
          value: debouncedSearchValue,
        }
      ).then((data) => {
        setContracts({
          ...data,
          results: data.results.map((contract: Contract) => ({
            id: contract._id,
            ref: {
              label: contract.ref,
              href: `/contracts/${contract._id}`,
            },
            status: contract.status,
            vehicle: {
              label: contract.vehicles.length,
              href: `/contracts/${contract._id}`,
            },
            createdAt: contract.createdAt,
          })),
        });
      });
    }
  }, [accessToken, searchFilters?.status, pagination, debouncedSearchValue]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          Contracts
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <SearchBar
          label="Search contracts by reference"
          value={searchValue}
          setValue={setSearchValue}
        />
        <ContractStatusFilters
          selectedContractStatus={searchFilters.status}
          setSelectedContractStatus={(status) => {
            const searchFiltersInitialStatusQueryParamKey = "status";
            router.push(
              `/contracts?${searchFiltersInitialStatusQueryParamKey}=${status}`
            );
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <DataTable
          count={contracts.count}
          start={contracts.start}
          limit={contracts.limit}
          rows={contracts.results}
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
