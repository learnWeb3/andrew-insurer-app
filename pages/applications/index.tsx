import Container from "@mui/material/Container";
import { ApplicationsConcern } from "../../concerns/applications";
import { useRouter } from "next/router";
import { ApplicationStatus } from "../../lib/application-status.enum";
import { OidcSecure } from "@axa-fr/react-oidc";
import { SetAuthenticatedUser } from "../../concerns/authenticated-user/SetAuthenticatedUser";
import { OidcRoleGuard } from "../../components/OidcRoleGuard";
import { AvailableRoles } from "../../lib/available-roles.enum";
import { useEffect, useState } from "react";

export default function Applications() {
  const router = useRouter();
  const searchFiltersInitialStatusQueryParamKey = "status";
  const [searchFilters, setSearchFilters] = useState<{
    status: ApplicationStatus;
  } | null>(null);

  useEffect(() => {
    if (router?.query?.[searchFiltersInitialStatusQueryParamKey]) {
      setSearchFilters({
        status: router?.query?.[
          searchFiltersInitialStatusQueryParamKey
        ] as ApplicationStatus,
      });
    } else {
      setSearchFilters({
        status: ApplicationStatus.PENDING,
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
            {searchFilters ? (
              <ApplicationsConcern
                searchFilters={searchFilters}
                setSearchFilters={setSearchFilters}
              />
            ) : (
              false
            )}
          </Container>
        </SetAuthenticatedUser>
      </OidcRoleGuard>
    </OidcSecure>
  );
}
