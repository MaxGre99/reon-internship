export type AmoToken = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
};

export type InstallQuery = {
    code: string;
    referer: string;
    client_id: string;
    from_widget: string;
};

export type RemoveQuery = {
    account_id: string;
    client_uuid: string;
    signature: string;
    hook_reason: string;
};
