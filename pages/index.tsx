import Container from "@mui/material/Container";
import { HomeConcern } from "../concerns/home/index";
import { OidcSecure } from "@axa-fr/react-oidc";
import { AvailableRoles } from "../lib/available-roles.enum";
import { OidcRoleGuard } from "../components/OidcRoleGuard";
import { SetAuthenticatedUser } from "../concerns/authenticated-user/SetAuthenticatedUser";

export default function Home() {
  return (
    <OidcSecure>
      <OidcRoleGuard
        hasAccessRoles={[AvailableRoles.INSURER, AvailableRoles.SUPERADMIN]}
      >
        <SetAuthenticatedUser>
          <Container>
            <HomeConcern />
          </Container>
        </SetAuthenticatedUser>
      </OidcRoleGuard>
    </OidcSecure>
  );
}
