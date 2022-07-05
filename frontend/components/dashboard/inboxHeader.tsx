import {faCloudArrowUp} from "@fortawesome/free-solid-svg-icons";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {faAt} from "@fortawesome/free-solid-svg-icons";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {faArrowRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SearchBar from "./searchBar";

export default function InboxHeader(){
    return (
        <div className="border-b rounded-tl-lg rounded-tr-lg py-4 px-6 flex flex-row justify-between items-center">

            {/* Email + Learn more */}
            <div className="h-full flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center justify-start">
                    <FontAwesomeIcon icon={faAt} className="text-blue-600 text-sm"/>
                    <p className="text-sm font-bold">Email address</p>
                </div>

                <div className="flex flex-row gap-2 items-center justify-start">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400 text-sm"/>
                    <p className="text-sm text-gray-400">Your emails are secure. <a href='#' className="text-sm text-blue-600">Learn more</a></p>
                </div>

            </div>

            {/* Searchbar */}
            <SearchBar />

            {/* Buttons */}
            <div className="h-full flex flex-row items-center justify-end gap-6">
                <div className="flex flex-row justify-center items-center gap-2 py-2 px-4 bg-blue-600 text-white font-bold rounded-lg">
                    Sync
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                </div>

                <div className="flex flex-row justify-center items-center gap-2 py-2 px-4 bg-blue-600 text-white font-bold rounded-lg">
                    Send
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>
            </div>
        </div>
    )
}