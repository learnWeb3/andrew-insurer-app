import Container from "@mui/material/Container";
import { UsersConcern } from "../../concerns/users/index";
import { OidcSecure } from "@axa-fr/react-oidc";
import { OidcRoleGuard } from "../../components/OidcRoleGuard";
import { AvailableRoles } from "../../lib/available-roles.enum";
import { SetAuthenticatedUser } from "../../concerns/authenticated-user/SetAuthenticatedUser";

export default function Users() {
  return (
    <OidcSecure>
      <OidcRoleGuard
        hasAccessRoles={[AvailableRoles.INSURER, AvailableRoles.SUPERADMIN]}
      >
        <SetAuthenticatedUser>
          <Container>
            <UsersConcern />
          </Container>
        </SetAuthenticatedUser>
      </OidcRoleGuard>
    </OidcSecure>
  );
}
