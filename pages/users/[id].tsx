import Container from "@mui/material/Container";
import { UserConcern } from "../../concerns/user/index";
import { OidcSecure } from "@axa-fr/react-oidc";
import { useRouter } from "next/router";
import { OidcRoleGuard } from "../../components/OidcRoleGuard";
import { AvailableRoles } from "../../lib/available-roles.enum";
import { SetAuthenticatedUser } from "../../concerns/authenticated-user/SetAuthenticatedUser";

export default function User() {
  const router = useRouter();
  return (
    <OidcSecure>
      <OidcRoleGuard
        hasAccessRoles={[AvailableRoles.INSURER, AvailableRoles.SUPERADMIN]}
      >
        <SetAuthenticatedUser>
          <Container>
            <UserConcern id={(router?.query?.id as string) || null} />
          </Container>
        </SetAuthenticatedUser>
      </OidcRoleGuard>
    </OidcSecure>
  );
}
