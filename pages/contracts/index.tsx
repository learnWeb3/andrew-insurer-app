import Container from "@mui/material/Container";
import { ContractsConcern } from "../../concerns/contracts";
import { OidcSecure } from "@axa-fr/react-oidc";
import { SetAuthenticatedUser } from "../../concerns/authenticated-user/SetAuthenticatedUser";
import { OidcRoleGuard } from "../../components/OidcRoleGuard";
import { AvailableRoles } from "../../lib/available-roles.enum";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ContractStatus } from "../../lib/contract-status.enum";

export default function Contracts() {
  const searchFiltersInitialStatusQueryParamKey = "status";
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState<{
    status: ContractStatus;
  }>({
    status: ContractStatus.ACTIVE,
  });

  useEffect(() => {
    if (router?.query?.[searchFiltersInitialStatusQueryParamKey]) {
      setSearchFilters({
        status: router?.query?.[
          searchFiltersInitialStatusQueryParamKey
        ] as ContractStatus,
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
            <ContractsConcern
              setSearchFilters={setSearchFilters}
              searchFilters={searchFilters}
            />
          </Container>
        </SetAuthenticatedUser>
      </OidcRoleGuard>
    </OidcSecure>
  );
}
