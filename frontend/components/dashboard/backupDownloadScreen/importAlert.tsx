import {ExclamationIcon} from "@heroicons/react/outline";

export default function ImportAlert(){
    return (
        <div className="bg-yellow-50 p-4 rounded-md my-3">
            <div className="flex">
                <div className="flex-shrink-0">
                    <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                        Once you download your emails to this device, they will be deleted from the cloud.
                    </p>
                </div>
            </div>
        </div>
    )
}