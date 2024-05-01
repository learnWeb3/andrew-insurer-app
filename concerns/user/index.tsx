import { Grid, Typography } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { useEffect, useState } from "react";
import { UserDetail } from "./UserDetail";
import { ContractsDetail } from "./ContractsDetail";
import { DevicesDetail } from "./DevicesDetails";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import {
  findUser,
  findUserContracts,
  findUserDevices,
  findUserSubscriptionApplications,
} from "../../services/andrew-api.service";
import { Customer } from "../../lib/customer.interface";
import { PaginatedResults } from "../../lib/paginated-results.interface";
import { ContractStatus } from "../../lib/contract-status.enum";
import { DeviceStatus } from "../../lib/device-status.enum";
import { Contract } from "../../lib/contract.interface";
import { Device } from "../../lib/device.interface";
import { SubscriptionApplicationsDetails } from "./SubscriptionApplicationsDetails";
import { ApplicationStatus } from "../../lib/application-status.enum";
import { Application } from "../../lib/subscription-application.interface";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";

export interface UserConcernProps {
  id: string | null;
}

export function UserConcern({ id = null }: UserConcernProps) {
  const { accessToken } = useOidcAccessToken();
  const [user, setUser] = useState<Customer | null>(null);
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

  const {
    pagination: contractsPagination,
    setPagination: setContractsPagination,
  } = usePagination(10, 1);

  const { pagination: devicesPagination, setPagination: setDevicesPagination } =
    usePagination(10, 1);

  const {
    pagination: subscriptionApplicationsPagination,
    setPagination: setSubscriptionApplicationsPagination,
  } = usePagination(10, 1);

  const [searchValueContracts, setSearchValueContracts] = useState<string>("");
  const debouncedSearchValueContracts = useDebounce(searchValueContracts, 400);
  useEffect(() => {
    if (id && accessToken) {
      findUser(id, accessToken).then((data) => {
        setUser(data);
      });
      findUserContracts(
        id,
        accessToken,
        {
          start: (contractsPagination.page - 1) * contractsPagination.pageSize,
          limit: contractsPagination.pageSize,
        },
        { value: debouncedSearchValueContracts }
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
  }, [id, accessToken, contractsPagination, debouncedSearchValueContracts]);

  const [searchValueDevices, setSearchValueDevices] = useState<string>("");
  const debouncedSearchValueDevices = useDebounce(searchValueDevices, 400);
  useEffect(() => {
    if (id && accessToken) {
      findUserDevices(
        id,
        accessToken,
        {
          start: (devicesPagination.page - 1) * devicesPagination.pageSize,
          limit: devicesPagination.pageSize,
        },
        { value: debouncedSearchValueDevices }
      ).then((data) => {
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
    }
  }, [id, accessToken, devicesPagination, debouncedSearchValueDevices]);

  const [
    searchValueSubscriptionApplications,
    setSearchValueSubscriptionApplications,
  ] = useState<string>("");
  const debouncedSearchValueSubscriptionApplications = useDebounce(
    searchValueSubscriptionApplications,
    400
  );
  useEffect(() => {
    if (id && accessToken && subscriptionApplicationsPagination) {
      findUserSubscriptionApplications(
        id,
        accessToken,
        {
          start:
            (subscriptionApplicationsPagination.page - 1) *
            subscriptionApplicationsPagination.pageSize,
          limit: subscriptionApplicationsPagination.pageSize,
        },
        { value: debouncedSearchValueSubscriptionApplications }
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
  }, [
    id,
    accessToken,
    subscriptionApplicationsPagination,
    debouncedSearchValueSubscriptionApplications,
  ]);

  const [errors, setErrors] = useState<{ [field: string]: string[] }>({
    firstName: [],
    lastName: [],
    email: [],
    phoneNumber: [],
    address: [],
    city: [],
    postCode: [],
    country: [],
  });

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Breadcrumb
          parts={
            user
              ? [
                  {
                    label: "Users",
                    href: "/users",
                  },
                  {
                    label: user.fullName,
                    href: `/users/${user._id}`,
                  },
                ]
              : [
                  {
                    label: "Users",
                    href: "/users",
                  },
                ]
          }
        />
      </Grid>
      <Grid
        item
        xs={12}
        lg={9}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexWrap: "wrap-reverse",
        }}
      >
        <Typography variant="h6" component="h2" noWrap>
          {user?.fullName}
        </Typography>
      </Grid>
      {user ? (
        <Grid item xs={12}>
          <UserDetail
            user={user}
            setUser={setUser}
            errors={errors}
            setErrors={setErrors}
            save={async (data) => console.log(data)}
          />
        </Grid>
      ) : (
        false
      )}
      <Grid item xs={12}>
        <SubscriptionApplicationsDetails
          applications={subscriptionApplications}
          setPagination={setSubscriptionApplicationsPagination}
          setSearchValue={setSearchValueSubscriptionApplications}
          searchValue={searchValueSubscriptionApplications}
        />
      </Grid>
      <Grid item xs={12}>
        <ContractsDetail
          contracts={contracts}
          setPagination={setContractsPagination}
          setSearchValue={setSearchValueContracts}
          searchValue={searchValueContracts}
        />
      </Grid>
      <Grid item xs={12}>
        <DevicesDetail
          devices={devices}
          setPagination={setDevicesPagination}
          setSearchValue={setSearchValueDevices}
          searchValue={searchValueDevices}
        />
      </Grid>
    </Grid>
  );
}
