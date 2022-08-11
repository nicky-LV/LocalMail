import {ArrowRightIcon, CloudDownloadIcon, CloudUploadIcon, LogoutIcon, SupportIcon} from "@heroicons/react/outline";
import {ScreenEnum} from "../../../types";

interface actionsProps {
    setScreen: (screen: ScreenEnum) => any
}

export default function DashboardActions(props: actionsProps){
    const actions = [
        {
            title: "Send an email",
            icon: <ArrowRightIcon />,
            onClick: () => props.setScreen(ScreenEnum.SEND_SCREEN)
        },
        {
            title: "Backup",
            icon: <CloudUploadIcon />,
            onClick: () => props.setScreen(ScreenEnum.BACKUP_SCREEN)
        },
        {
            title: "Download",
            icon: <CloudDownloadIcon />,
            onClick: () => props.setScreen(ScreenEnum.BACKUP_SCREEN)
        },
        {
            title: "Support",
            icon: <SupportIcon />,
            onClick: () => null
        },
        {
            title: "Sign out",
            icon: <LogoutIcon />,
            onClick: () => null
        }
    ]
    return (
        <div className="grid grid-cols-1 divide-y">
            {actions.map(action => (
                <button className="flex flex-row justify-start items-center gap-2 p-3 hover:bg-gray-100"
                        onClick={(e) => {
                            e.preventDefault()
                            // @ts-ignore
                            action.onClick()
                        }}
                >
                    <div className="text-gray-800 h-5 w-5">
                        {action.icon}
                    </div>
                    <p className="text-gray-800 text-md">{action.title}</p>
                </button>
            ))}
        </div>
    )
}