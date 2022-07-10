import {Email, FolderName} from "../../types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {getFolderEmails} from "../../utils";

interface ListEmailsProps {
    folder: FolderName,
    setSelectedEmail: (email: Email) => void,
    uuid: string
}

export default function ListEmails(props: ListEmailsProps){
    const [selected, setSelected] = useState<number | null>(null)
    const [emails, setEmails] = useState<Email[] | null>(null);

    useEffect(() => {
        setEmails(getFolderEmails(props.uuid, props.folder))
    }, [])

    return (
        <>
            <ul role="list" className="divide-y divide-gray-200 h-screen overflow-y-scroll" >
                {emails && emails.map((email) => (
                    <li key={email.id}
                        onClick={() => setSelected(email.id)}
                        className="h-14 flex flex-row items-center justify-between p-4"
                    >
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                props.setSelectedEmail(email)
                            }}
                            key={email.id}
                            className={`${selected === email.id ? "text-blue-600" : "text-gray-500"} text-sm flex 
                    flex-row gap-6 items-center justify-start h-full w-full min-h-full`}>
                            <div className="rounded-lg py-2 px-3 bg-gray-100 items-center justify-center">
                                <p className="text-sm">{email.sender.split('@')[1][0].toUpperCase()}</p>
                            </div>
                            <p className="truncate text-sm">
                                {email.subject ? email.subject : "(No Subject)"}
                            </p>

                        </button>

                        {/* Buttons */}
                        <div className="flex flex-col h-full justify-between">
                            {/* Time */}
                            <p className="text-xs text-gray-400">{new Date(email.datetime).toLocaleString().split(",")[0]}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}