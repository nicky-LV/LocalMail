import {Email, FolderName} from "../../types";
import {faBoxArchive, faEllipsis, faLock, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {moveEmail} from "../../utils";

export default function EmailPanel(props: {
    email: Email,
    uuid: string,
    selectedFolder: FolderName,
    setSelectedEmail: (email: Email | null) => void,
    updateEmailList: () => void
}){
    const [iconSelected, setIconSelected] = useState<boolean>(false);

    function get12HourTime(time: string): string{
        const split_time = time.split(":")
        const hours = ((parseInt(split_time[0]) + 11) % 12 + 1);
        const suffix = hours >= 12 ? "PM":"AM"

        return `${hours}:${split_time[1]} ${suffix}`
    }

    return (
        <div className="p-4 flex flex-col gap-6">

            {/* Header */}
            <div>
                <div className="flex flex-row justify-between items-center">
                    <p className="text-lg text-bold truncate">{props.email.subject ? props.email.subject : "(No Subject)"}</p>

                    {/* Ellipsis icon */}
                    {!iconSelected && <a href="#" onClick={(e) => {
                        e.preventDefault()
                        setIconSelected(true)
                    }}>
                        <FontAwesomeIcon icon={faEllipsis} className="text-gray-400 hover:text-blue-600" />
                    </a>}

                    {/* Buttons */}
                    {iconSelected && <div className="flex flex-row items-center gap-3">

                        {props.selectedFolder !== FolderName.TRASH && <a href="#" onClick={(e) => {
                            e.preventDefault()
                            moveEmail(props.uuid, props.email, props.selectedFolder, FolderName.TRASH)
                            props.setSelectedEmail(null)
                            props.updateEmailList()
                        }}>
                            <FontAwesomeIcon icon={faTrash} className="text-gray-400 hover:text-red-600 text-sm"/>
                        </a>}

                        {props.selectedFolder !== FolderName.ARCHIVED && <a href="#" onClick={(e) => {
                            e.preventDefault()
                            moveEmail(props.uuid, props.email, props.selectedFolder, FolderName.ARCHIVED)
                            props.setSelectedEmail(null)
                            props.updateEmailList()
                        }}>
                            <FontAwesomeIcon
                                icon={faBoxArchive}
                                className="text-gray-400 hover:text-green-500 text-sm"
                            />
                        </a>}
                    </div>}
                </div>

                <div className="flex flex-row gap-2 font-bold text-xs text-blue-600 justify-start items-center mt-1">
                    <FontAwesomeIcon icon={faLock} />
                    <p>Local</p>
                </div>

            </div>



            {/* Email */}
            <div className="flex flex-col gap-3 h-screen border rounded-tl-lg rounded-tr-lg p-6">

                {/* Email metadata */}
                <div className="flex flex-row justify-between">
                    {/* From */}
                    <div className="flex flex-row gap-3 justify-start items-center overflow-scroll">
                        <p className="text-sm">From:</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {props.email.sender}
                    </span>
                    </div>

                    {/* Time */}
                    <p className="text-gray-400 text-sm">{get12HourTime(new Date(props.email.datetime).toLocaleString())}</p>
                </div>

                <div className="flex flex-row justify-between border-b pb-4">
                    {/* To */}
                    <div className="flex flex-row gap-3 justify-start items-center overflow-scroll">
                        <p className="text-sm">To:</p>
                        {props.email.recipients.map((recipient) => (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {recipient}
                    </span>
                        ))}
                    </div>

                    {/* Date */}
                    <p className="text-gray-400 text-sm">{new Date(props.email.datetime).toLocaleString().split(",")[0]}</p>
                </div>

                {/* --- */}

                {/* Email body */}
                <div id="body" className="text-sm py-4">
                    {props.email.body}
                </div>
            </div>



        </div>
    )
}