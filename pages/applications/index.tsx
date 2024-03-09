import Container from "@mui/material/Container";
import { ApplicationsConcern } from "../../concerns/applications";
import { useRouter } from "next/router";
import { ApplicationStatus } from "../../lib/application-status.enum";
import { OidcSecure } from "@axa-fr/react-oidc";
import { SetAuthenticatedUser } from "../../concerns/authenticated-user/SetAuthenticatedUser";
import { OidcRoleGuard } from "../../components/OidcRoleGuard";
import { AvailableRoles } from "../../lib/available-roles.enum";

export default function Applications() {
  const router = useRouter();
  return (
    <OidcSecure>
      <OidcRoleGuard
        hasAccessRoles={[AvailableRoles.INSURER, AvailableRoles.SUPERADMIN]}
      >
        <SetAuthenticatedUser>
          <Container>
            <ApplicationsConcern
              initialSearchFiltersStatus={
                (router?.query?.status as ApplicationStatus) ||
                ApplicationStatus.PENDING
              }
            />
          </Container>
        </SetAuthenticatedUser>
      </OidcRoleGuard>
    </OidcSecure>
  );
}
