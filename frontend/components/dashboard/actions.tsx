import {CloudUploadIcon, ArrowRightIcon} from "@heroicons/react/outline";

interface actionsProps {

}

const actions = [
    {
        title: "Send an email",
        icon: <ArrowRightIcon />
    },
    {
        title: "Backup",
        icon: <CloudUploadIcon />
    }
]

export default function Actions(props: actionsProps){
    return (
        <div className="grid grid-cols-1 divide-y">
            {actions.map(action => (
                <button className="flex flex-row justify-start items-center gap-2 p-3 hover:bg-gray-100">
                    <div className="text-gray-800 h-5 w-5">
                        {action.icon}
                    </div>
                    <p className="text-gray-800 text-md">{action.title}</p>
                </button>
            ))}
        </div>
    )
}