export interface ManifestType {
  oauth2?: {
    client_id: string;
    scopes: string[];
    redirect_uri: string;
  };
}
 