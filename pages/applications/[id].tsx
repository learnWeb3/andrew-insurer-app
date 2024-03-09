import Container from "@mui/material/Container";
import { ApplicationConcern } from "../../concerns/application";
import { OidcSecure } from "@axa-fr/react-oidc";
import { useRouter } from "next/router";
import { OidcRoleGuard } from "../../components/OidcRoleGuard";
import { AvailableRoles } from "../../lib/available-roles.enum";
import { SetAuthenticatedUser } from "../../concerns/authenticated-user/SetAuthenticatedUser";

export default function Application() {
  const router = useRouter();
  return (
    <OidcSecure>
      <OidcRoleGuard
        hasAccessRoles={[AvailableRoles.INSURER, AvailableRoles.SUPERADMIN]}
      >
        <SetAuthenticatedUser>
          <Container>
            <ApplicationConcern id={(router?.query?.id as string) || null} />
          </Container>
        </SetAuthenticatedUser>
      </OidcRoleGuard>
    </OidcSecure>
  );
}
