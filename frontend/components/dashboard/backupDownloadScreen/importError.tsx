import {ExclamationCircleIcon} from "@heroicons/react/outline";

export default function ImportError(){
    return (
        <div className="rounded-md bg-red-50 p-4 my-3">
            <div className="flex">
                <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Import failed</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                        <p>
                            Please try again later or contact support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}