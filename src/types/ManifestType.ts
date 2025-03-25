export interface ManifestType {
  manifest_version: number;
  name: string;
  version: string;
  action?: {
    default_popup?: string;
  };
  background?: {
    service_worker: string;
    type: "module";
  };
  options_page?: string;
  description: string;
  icons: {
    [key: string]: string;
  };
  oauth2?: {
    client_id: string;
    scopes: string[];
  };
  permissions: string[];
}
