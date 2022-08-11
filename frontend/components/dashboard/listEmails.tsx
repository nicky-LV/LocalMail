import {API_EMAIL, Email, FolderName} from "../../types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {getFolderEmails} from "../../utils";
import NoEmails from "./noEmails";

interface ListEmailsProps {
    folder: FolderName,
    setOpenedEmail: (email: API_EMAIL) => void,
    uuid: string,
    selectEmail: (emailId: number) => void,
    deselectEmail: (emailId: number) => void
}

export default function ListEmails(props: ListEmailsProps){
    const [emails, setEmails] = useState<API_EMAIL[] | null>(null);

    useEffect(() => {
        setEmails(getFolderEmails(props.uuid, props.folder))
    }, [])

    return (
        <>
            {emails && emails.map((email) => {
                return (email != null && <div className="grid grid-cols-1 divide-y overflow-y-scroll" >
                        <button onClick={(e) => {
                            props.setOpenedEmail(email)
                        }}
                            key={email.id}
                            className="p-3 h-14 flex flex-row items-center justify-between hover:bg-gray-100 rounded-xl"
                        >
                            <div className="flex flex-row gap-6 items-center justify-start h-full w-full">
                                <input
                                    id={`${email.id}-checkbox`}
                                    type="checkbox"
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                    }}
                                    onChange={() => {
                                        if (document.getElementById(`${email.id}-checkbox`).checked){
                                            props.selectEmail(email.id)
                                        }

                                        else {
                                            props.deselectEmail(email.id)
                                        }
                                    }}
                                />
                                <p className="truncate text-sm">
                                    {email.subject ? email.subject : "(No Subject)"}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col h-full justify-between">
                                {/* Time */}
                                <p className="text-xs text-gray-400">{new Date(email.datetime).toLocaleString().split(",")[0]}</p>
                            </div>
                        </button>
                    </div>
                )})}

            {emails?.length == 0 && <NoEmails />}
        </>
    )
}