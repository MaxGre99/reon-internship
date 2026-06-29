export type AmoToken = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
};

export type AmoCustomField = {
    field_id: number;
    values: { value: string | number; enum_id?: number }[];
};

export type AmoContact = {
    id: number;
    custom_fields_values: AmoCustomField[] | null;
};

export type AmoDeal = {
    id: number;
    price: number;
    custom_fields_values: AmoCustomField[] | null;
    _embedded: {
        contacts: {
            id: number;
            is_main: boolean;
        }[];
    };
};

export type AmoTask = {
    id: number;
    text: string;
    task_type_id: number;
    is_completed: boolean;
    entity_id: number;
    entity_type: string;
};

export type AmoWebhookLead = {
    id: string;
};

export type AmoWebhookTask = {
    id: string;
    text: string;
    task_type: string;
    element_id: string;
    element_type: string;
    action_close: string;
};

export type AmoWebhookBody = {
    leads?: {
        update?: AmoWebhookLead[];
    };
    task?: {
        update?: AmoWebhookTask[];
    };
};
