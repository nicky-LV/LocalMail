import {Email, FolderName} from "../../types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

interface ListEmailsProps {
    emails: Email[],
    folder: FolderName,
    setSelectedEmail: (emailId: number) => void
}

export default function ListEmails(props: ListEmailsProps){
    const [selected, setSelected] = useState<number | null>(null)
    return (
        <>
            {/* Folder Header */}
            <div className="h-14 border-b flex flex-row justify-center items-center">
                <p className="mx-auto my-auto font-bold text-lg">{props.folder}</p>
                <p></p>
            </div>
            <ul role="list" className="divide-y divide-gray-200 h-screen" >
                {props.emails.map((email) => (
                    <li key={email.id}
                        onClick={() => setSelected(email.id)}
                        className="h-14"
                    >
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                props.setSelectedEmail(email.id)
                            }}
                            className={`${selected === email.id ? "text-blue-600" : "text-gray-500"} text-sm py-4 flex 
                    flex-row gap-2 items-center justify-center h-full w-full min-h-full`}>
                            <p className="truncate">
                                {email.subject}
                            </p>

                        </button>
                    </li>
                ))}
            </ul>
        </>
    )
}