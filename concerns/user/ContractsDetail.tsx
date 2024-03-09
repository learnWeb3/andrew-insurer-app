import { Grid, Typography } from "@mui/material";
import { SearchBar } from "../../components/SearchBar";
import DataTable from "../../components/Datatable";
import { RenderCellLink } from "../../components/Datatable/RenderCellLink";
import { GridColDef } from "@mui/x-data-grid";
import { RenderCellDate } from "../../components/Datatable/RenderCellDate";
import { RenderCellContractSatus } from "../../components/Datatable/RenderCellStatus";
import { ContractStatus } from "../../lib/contract-status.enum";
import { PaginatedResults } from "../../lib/paginated-results.interface";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

export interface ContractsDetailProps {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  setPagination: (newPagination: { pageSize: number; page: number }) => void;
  contracts: PaginatedResults<{
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
  }>;
}
export function ContractsDetail({
  contracts,
  setPagination,
  searchValue,
  setSearchValue,
}: ContractsDetailProps) {
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
      field: "paymentDueDate",
      headerName: "Payment due date",
      flex: 1,
      renderCell: RenderCellDate,
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
          Contracts
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={4}>
        <Grid item xs={12}>
          <SearchBar
            label="Search contracts by reference"
            value={searchValue}
            setValue={setSearchValue}
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
    </Grid>
  );
}
