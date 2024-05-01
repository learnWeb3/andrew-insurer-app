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
import { RenderCellDate } from "../../components/Datatable/RenderCellDate";
import { RenderCellLink } from "../../components/Datatable/RenderCellLink";
import { NewButton } from "../../components/NewButton";
import { useToggledState } from "../../hooks/useToggledState";
import { ModalWrapper } from "../../components/ModalWrapper";
import { CreateUserModalContent } from "../user/CreateUserModalContent";
import { useEffect, useState } from "react";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import { listUsers } from "../../services/andrew-api.service";
import { Customer } from "../../lib/customer.interface";
import { PaginatedResults } from "../../lib/paginated-results.interface";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import { UsersCardsList } from "./UserCardsList";

export function UsersConcern() {
  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "identity",
      flex: 1,
      renderCell: RenderCellLink,
    },
    {
      field: "contractsCount",
      headerName: "contract number",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: RenderCellLink,
    },
    {
      field: "currentDiscountRate",
      headerName: "discount rate",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created at",
      flex: 1,
      renderCell: RenderCellDate,
    },
  ];

  const { toggled, open, close } = useToggledState(false);
  const { accessToken } = useOidcAccessToken();

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 400);

  const [customers, setCustomers] = useState<
    PaginatedResults<{
      id: string;
      fullName: {
        label: string;
        href: string;
      };
      currentDiscountRate: number;
      createdAt: string;
      contractsCount: {
        label: number;
        href: string;
      };
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
      listUsers(
        accessToken,
        {
          start: (pagination.page - 1) * pagination.pageSize,
          limit: pagination.pageSize,
        },
        {
          value: debouncedSearchValue,
        }
      ).then((data) => {
        setCustomers({
          ...data,
          results: data.results.map((customer: Customer) => ({
            id: customer._id,
            fullName: {
              label: customer.fullName,
              href: `/users/${customer._id}`,
            },
            currentDiscountRate: customer?.discount || 0,
            createdAt: customer.createdAt,
            contractsCount: {
              label: customer?.contracts?.[0]?.count || 0,
              href: `/users/${customer._id}`,
            },
          })),
        });
      });
    }
  }, [accessToken, pagination, debouncedSearchValue]);

  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h6" component="h2" gutterBottom>
          Users
        </Typography>
      </Grid>
      <Grid
        item
        xs={6}
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
            Create user
          </Button>
        </Hidden>
      </Grid>
      <Grid item xs={12}>
        <SearchBar
          label="Search customers by firstname, lastname or email"
          value={searchValue}
          setValue={setSearchValue}
        />
      </Grid>

      <Grid item xs={12}>
        {matches ? (
          <DataTable
            count={customers.count}
            start={customers.start}
            limit={customers.limit}
            rows={customers.results}
            columns={columns}
            onPaginationChange={(newPagination) => {
              setPagination(newPagination);
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
          />
        ) : (
          <Stack gap={4}>
            <UsersCardsList rows={customers?.results || []} />
            {customers.count ? (
              <Pagination
                size="large"
                sx={{ mb: 4 }}
                count={Math.ceil(customers.count / pagination.pageSize)}
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
        content={<CreateUserModalContent close={close} />}
      />
    </Grid>
  );
}
