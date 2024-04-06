import Container from "@mui/material/Container";
import { DevicesConcern } from "../../concerns/devices/index";
import { OidcSecure } from "@axa-fr/react-oidc";
import { OidcRoleGuard } from "../../components/OidcRoleGuard";
import { SetAuthenticatedUser } from "../../concerns/authenticated-user/SetAuthenticatedUser";
import { AvailableRoles } from "../../lib/available-roles.enum";
import { useRouter } from "next/router";
import { DeviceStatus } from "../../lib/device-status.enum";
import { useEffect, useState } from "react";

export default function Devices() {
  const router = useRouter();
  const searchFiltersInitialStatusQueryParamKey = "status";
  const [searchFilters, setSearchFilters] = useState<{
    status: DeviceStatus;
  }>({
    status: DeviceStatus.PAIRED,
  });

  useEffect(() => {
    if (router?.query?.[searchFiltersInitialStatusQueryParamKey]) {
      setSearchFilters({
        status: router?.query?.[
          searchFiltersInitialStatusQueryParamKey
        ] as DeviceStatus,
      });
    }
  }, [router]);
  return (
    <OidcSecure>
      <OidcRoleGuard
        hasAccessRoles={[AvailableRoles.INSURER, AvailableRoles.SUPERADMIN]}
      >
        <SetAuthenticatedUser>
          <Container>
            <DevicesConcern
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
            />
          </Container>
        </SetAuthenticatedUser>
      </OidcRoleGuard>
    </OidcSecure>
  );
}
