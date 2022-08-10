import {API_EMAIL, Email, FolderName} from "../../../types";
import {ArrowLeftIcon, ChevronLeftIcon} from "@heroicons/react/outline";
import {useState} from "react";
import EmailActions from "./emailActions";

export default function ShowEmail(props: {
    email: API_EMAIL,
    uuid: string,
    selectedFolder: FolderName,
    setSelectedEmail: (email: API_EMAIL | null) => void
}){
    const [iconSelected, setIconSelected] = useState<boolean>(false);

    function get12HourTime(time: string): string{
        const split_time = time.split(":")
        const hours = ((parseInt(split_time[0]) + 11) % 12 + 1);
        const suffix = hours >= 12 ? "PM":"AM"

        return `${hours}:${split_time[1]} ${suffix}`
    }

    return (
        <div>
            <div className="flex flex-row items-center justify-between">
                <button className="flex flex-row justify-start items-center gap-3"
                        onClick={(e) => {
                            e.preventDefault()
                            props.setSelectedEmail(null)
                        }}
                >
                    {/* Back button */}
                    <ArrowLeftIcon className='hover:bg-gray-100 bg-gray-50 text-gray-700 hover:text-gray-900 group flex items-center rounded-lg w-8 h-8 p-1' />
                    {/* Subject */}
                    <h1 className="text-3xl font-bold text-black">{props.email.subject ? props.email.subject : "(No Subject)"}</h1>
                </button>
                {/* Actions */}
                {props.selectedFolder && <EmailActions
                    uuid={props.uuid}
                    email={props.email}
                    clearSelectedEmail={() => props.setSelectedEmail(null)}
                    selectedFolder={props.selectedFolder} />}
            </div>
            {/**
             <p className="text-gray-400 text-sm">{get12HourTime(new Date(props.email.datetime).toLocaleString())}</p>
             **/}
        </div>
    )
}