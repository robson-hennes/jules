export interface Client {
  id: string;
  name: string;
  contact: string;
  address: string;
  document: string;
  // Allows for future dynamic fields
  [key: string]: any;
}
