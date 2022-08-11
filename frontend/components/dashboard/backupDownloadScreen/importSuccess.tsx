import {BadgeCheckIcon} from "@heroicons/react/outline";

export default function ImportSuccess(){
    return (
        <div className="rounded-md bg-green-50 p-4 my-3">
            <div className="flex">
                <div className="flex-shrink-0">
                    <BadgeCheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Success</h3>
                    <div className="mt-2 text-sm text-green-700">
                        <p>
                            Your backed-up emails have been imported.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}