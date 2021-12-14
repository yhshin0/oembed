export interface OembedSpecList {
  provider_name: string;
  provider_url: string;
  endpoints: Endpoint[];
}

interface Endpoint {
  schemes?: string[];
  url: string;
  formats?: string[];
  discovery?: boolean;
}
