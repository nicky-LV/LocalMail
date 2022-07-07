import {Email} from "../../types";
import {faEllipsis, faTrash, faBoxArchive, faLock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

export default function EmailPanel(props: {
    email: Email
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
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-1">
                    <p className="text-lg text-bold truncate">{props.email.subject ? props.email.subject : "(No Subject)"}</p>
                    <div className="flex flex-row gap-2 font-bold text-xs text-blue-600 justify-start items-center">
                        <FontAwesomeIcon icon={faLock} />
                        <p>Local</p>
                    </div>
                </div>

                {/* Ellipsis icon */}
                {!iconSelected && <a href="#" onClick={(e) => {
                    e.preventDefault()
                    setIconSelected(true)
                }}>
                    <FontAwesomeIcon icon={faEllipsis} className="text-gray-400 hover:text-blue-600" />
                </a>}

                {/* Buttons */}
                {iconSelected && <div className="flex flex-row justify-end items-center gap-3">

                    <a href="#" onClick={(e) => {e.preventDefault()}}>
                        <FontAwesomeIcon icon={faTrash} className="text-gray-400 hover:text-red-600"/>
                    </a>

                    <a href="#" onClick={(e) => {e.preventDefault()}}>
                        <FontAwesomeIcon icon={faBoxArchive} className="text-gray-400 hover:text-green-500"/>
                    </a>
                </div>}

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