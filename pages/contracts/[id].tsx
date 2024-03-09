import Container from "@mui/material/Container";
import { ContractConcern } from "../../concerns/contract/index";
import { OidcSecure } from "@axa-fr/react-oidc";
import { useRouter } from "next/router";
import { OidcRoleGuard } from "../../components/OidcRoleGuard";
import { SetAuthenticatedUser } from "../../concerns/authenticated-user/SetAuthenticatedUser";
import { AvailableRoles } from "../../lib/available-roles.enum";

export default function Contracts() {
  const router = useRouter();
  return (
    <OidcSecure>
      <OidcRoleGuard
        hasAccessRoles={[AvailableRoles.INSURER, AvailableRoles.SUPERADMIN]}
      >
        <SetAuthenticatedUser>
          <Container>
            <ContractConcern id={(router?.query?.id as string) || null} />
          </Container>
        </SetAuthenticatedUser>
      </OidcRoleGuard>
    </OidcSecure>
  );
}
