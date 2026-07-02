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
