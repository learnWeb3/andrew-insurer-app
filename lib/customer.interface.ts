export interface Customer {
  _id?: string;
  insurer: false;
  authorizationServerUserId: string;
  contactInformations?: {
    phoneNumber?: string;
    email?: string;
  };
  paymentInformations: {
    ecommerceCustomer: string;
  };
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  identityDocs?: {
    idCardDocURL?: string;
    residencyProofDocURL?: string;
  };
  billingInformations?: {
    lastName?: string;
    firstName?: string;
    address?: string;
    postCode?: string;
    city?: string;
    country?: string;
  };
  contracts: {
    count: number;
  }[];
  discount: null;
}
