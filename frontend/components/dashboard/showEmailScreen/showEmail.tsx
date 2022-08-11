import {API_EMAIL, Email, FolderName} from "../../../types";
import {ArrowLeftIcon, ChevronLeftIcon, ClockIcon} from "@heroicons/react/outline";
import {useEffect, useState} from "react";
import EmailActions from "./emailActions";
import InitialsIcon from "./initialsIcon";
import NoContent from "./noContent";

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
        <section className="flex flex-col h-full divide-y gap-4">
            <div className="flex flex-col gap-3">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row justify-start items-center gap-3"

                    >
                        <button onClick={(e) => {
                            e.preventDefault()
                            props.setSelectedEmail(null)
                        }}>
                            {/* Back button */}
                            <ArrowLeftIcon className='hover:bg-gray-100 bg-gray-50 text-gray-700 hover:text-gray-900 group flex items-center rounded-lg w-8 h-8 p-1' />
                        </button>

                        {/* Subject */}
                        <h1 className="text-3xl font-bold text-black">{props.email.subject ? props.email.subject : "(No Subject)"}</h1>
                    </div>
                    {/* DashboardActions */}
                    {props.selectedFolder && <EmailActions
                        uuid={props.uuid}
                        email={props.email}
                        clearSelectedEmail={() => props.setSelectedEmail(null)}
                        selectedFolder={props.selectedFolder} />}
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3 justify-start items-center text-sm tracking-wide">
                        <ClockIcon className="h-4 w-4 text-gray-800" />
                        <p>{new Date(props.email.datetime).toLocaleString().split(",")[0]} - {get12HourTime(new Date(props.email.datetime).toLocaleString())}</p>
                        <p></p>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-3">
                        {/* From */}
                        <p className="text-black text-sm">From: </p>
                        <span className="text-black text-sm flex flex-row items-center gap-2 bg-gray-100 rounded-lg p-2">
                        <InitialsIcon initials={"TS"} />
                            {props.email.sender}
                    </span>
                    </div>
                </div>
            </div>

            {props.email.body ?
                <div className="py-4 h-full" id="body" dangerouslySetInnerHTML={{__html: props.email.body}}/>
                :
                <div className="h-full">
                    <NoContent/>
                </div>
            }


        </section>
    )
}