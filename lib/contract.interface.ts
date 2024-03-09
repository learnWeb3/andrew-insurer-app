import { ContractStatus } from "./contract-status.enum";
import { Customer } from "./customer.interface";

export interface Contract {
  _id: string;
  ref: string;
  customer: Customer;
  status: ContractStatus;
  ecommerceProduct: string;
  ecommerceGateway: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  vehicles: [];
}
