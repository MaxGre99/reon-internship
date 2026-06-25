export type AmoToken = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export type AmoCustomField = {
  field_id: number;
  values: { value: string | number }[];
};

export type AmoContact = {
  id: number;
  name: string;
  custom_fields_values: AmoCustomField[] | null;
};

export type AmoWebhookContact = {
  id: string;
  name: string;
};

export type AmoWebhookBody = {
  contacts?: {
    add?: AmoWebhookContact[];
    update?: AmoWebhookContact[];
  };
};
