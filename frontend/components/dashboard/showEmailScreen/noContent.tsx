import {DocumentIcon} from "@heroicons/react/outline";

export default function NoContent(){
    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-row gap-2 items-center justify-start text-gray-500">
                <DocumentIcon className="w-6 h-6" />
                <p>Empty</p>
            </div>
        </div>
    )
}