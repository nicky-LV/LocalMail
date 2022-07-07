import {IconProp} from "@fortawesome/fontawesome-svg-core";

export interface LoggedInUser {
    uuid: string
    access_token: string
    refresh_token: string
}

export enum FolderName {
    INBOX = "Inbox",
    ARCHIVED = "Archived",
    TRASH = "Trash"
}

export interface Folder {
    name: FolderName,
    icon: IconProp
}

export interface User {
    uuid: string,
    email_address: string
}

export interface Email {
    id: number,
    subject: string,
    sender: string,
    recipients: string[]
    body: string,
    datetime: string
}

export enum LoginField {
    EMAIL = "email",
    PASSWORD = "password"
}

export interface LoginErrors {
    detail: {
        field: LoginField
        message: string
    }
}

export enum DashboardErrorType {
    ERROR_RETRIEVING_EMAILS
}

export interface DashboardError {
    detail: {
        error: DashboardErrorType,
        message: string
    }
}
