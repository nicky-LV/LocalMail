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
    recipients: User[]
    body: any,
    datetime: string
}

