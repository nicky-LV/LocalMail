import {Folder, FolderName} from "../../types";
import {faBoxArchive, faInbox, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

const folders_: Folder[] = [
    {
        name: FolderName.INBOX,
        icon: faInbox
    },
    {
        name: FolderName.ARCHIVED,
        icon: faBoxArchive
    },
    {
        name: FolderName.TRASH,
        icon: faTrash
    }
]

interface FoldersProps {
    setSelectedFolder: (folder: FolderName) => void,
    selectedFolder: FolderName
}


export default function Folders(props: FoldersProps){
    const [hovered, setHovered] = useState<FolderName | null>(null);

    return (<ul role="list" className="divide-y divide-gray-200 h-screen" >
            {folders_.map((folder) => (
                <li key={folder.name}
                    onMouseEnter={() => setHovered(folder.name)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => props.setSelectedFolder(folder.name)}
                    className="h-14"
                >
                    <button onClick={(e) => e.preventDefault()} className={`${props.selectedFolder === folder.name ? "text-blue-600" : "text-gray-500"} text-sm py-4 flex 
                    flex-row gap-2 items-center justify-center w-full min-h-full`}>
                        <FontAwesomeIcon icon={folder.icon} className={`${props.selectedFolder !== folder.name && hovered == folder.name ? 'text-gray-700': null}`}/>
                        <p className={`${props.selectedFolder !== folder.name && hovered == folder.name ? 'text-gray-700': null}`}>{folder.name}</p>
                    </button>
                </li>
            ))}
        </ul>
    )
}

