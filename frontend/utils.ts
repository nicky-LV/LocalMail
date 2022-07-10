import {Email, FolderName} from "./types";
import {json} from "stream/consumers";

function localStorageEmpty(uuid: string): boolean{
    if (window.localStorage.getItem(uuid) == null || window.localStorage.getItem(uuid) == '[]'){
        return true
    }

    return false
}

function folderEmpty(uuid: string, folder: FolderName): boolean {
    if (window.localStorage.getItem(`${uuid}-${folder}`) == null || window.localStorage.getItem(`${uuid}-${folder}`) == '[]'){
        return true
    }

    else {
        try {
            const folderContents: Email[] = JSON.parse(window.localStorage.getItem(`${uuid}-${folder}`) as string)
            return false
        }

        catch (e) {
            throw e
        }
    }
}

export function getFolderEmails(uuid: string, folder: FolderName): Email[] {
    if (folderEmpty(uuid, folder)){
        return []
    }

    else {
        return JSON.parse(window.localStorage.getItem(`${uuid}-${folder}`) as string)
    }
}

export function updateFolderEmails(uuid: string, emails: Email[] | Email, folder: FolderName): void {
    // If single email is passed, convert it to an array
    if (!Array.isArray(emails)){
        emails = [emails]
    }

    if (folderEmpty(uuid, folder)){
        window.localStorage.setItem(`${uuid}-${folder}`, JSON.stringify(emails))
    }

    else {
        const updatedFolderEmails: Email[] = emails.concat(getFolderEmails(uuid, folder))
         window.localStorage.setItem(`${uuid}-${folder}`, JSON.stringify(updatedFolderEmails))
    }
}

function findEmail(uuid: string, email_id: number, fromFolder: FolderName): [Email, number] | null{
    if (folderEmpty(uuid, fromFolder)) {
        return null
    }

    else {
        const folderEmails = getFolderEmails(uuid, fromFolder)

        for (let i=0; i<folderEmails.length; i++){
            let email = folderEmails[i]
            if (email.id == email_id){
                return [email, i]
            }
        }

        return null
    }
}

function deleteEmailFromFolder(uuid: string, email: Email, fromFolder: FolderName, idx: number): void {
    if (findEmail(uuid, email.id, fromFolder) != null){
        let folderEmails = getFolderEmails(uuid, fromFolder)
        folderEmails.splice(idx, 1)
        window.localStorage.setItem(`${uuid}-${fromFolder}`, JSON.stringify(folderEmails))
    }
}

export function moveEmail(uuid: string, email: Email, fromFolder: FolderName, toFolder: FolderName): void {
    if (findEmail(uuid, email.id, fromFolder) != null){
        const [foundEmail, idx]: any = findEmail(uuid, email.id, fromFolder)
        deleteEmailFromFolder(uuid, foundEmail, fromFolder, idx)
        updateFolderEmails(uuid, email, toFolder)
    }

    else {
        throw Error(`Email with ID ${email.id} could not be found in folder ${fromFolder}`)
    }
}