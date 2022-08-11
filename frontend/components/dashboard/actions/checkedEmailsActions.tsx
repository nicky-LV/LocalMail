import {API_EMAIL, EmailActionFolder, FolderName} from "../../../types";
import {ArchiveIcon, ArrowRightIcon, ChevronDownIcon, InboxIcon, ReplyIcon, TrashIcon} from "@heroicons/react/outline";
import {moveEmail} from "../../../utils";
import {Menu, Transition} from "@headlessui/react";
import {Fragment} from "react";

interface Props {
    selectedFolder: FolderName,
    uuid: string
}

export default function CheckedEmailsActions(props: Props){
    const moveToTrash: EmailActionFolder = {
        folderName: FolderName.TRASH,
        text: "Delete",
        icon: <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />,
        onClick: (uuid: string, email: API_EMAIL, fromFolder: FolderName, toFolder: FolderName): any => {
            moveEmail(uuid, email, fromFolder, toFolder)
        }
    }

    const moveToArchived: EmailActionFolder = {
        folderName: FolderName.ARCHIVED,
        text: "Archive",
        icon: <ArchiveIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />,
        onClick: (uuid: string, email: API_EMAIL, fromFolder: FolderName, toFolder: FolderName): any => {
            moveEmail(uuid, email, fromFolder, toFolder)
        }

    }

    const moveToInbox: EmailActionFolder = {
        folderName: FolderName.INBOX,
        text: "Move to Inbox",
        icon: <InboxIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />,
        onClick: (uuid: string, email: API_EMAIL, fromFolder: FolderName, toFolder: FolderName): any => {
            moveEmail(uuid, email, fromFolder, toFolder)
        }
    }

    // Keys represent the folder the email is in. Values are the folders that the email can be moved to.
    const moveToFolder = {
        [FolderName.INBOX]: [moveToArchived, moveToTrash],
        [FolderName.TRASH]: [moveToInbox, moveToArchived],
        [FolderName.ARCHIVED]: [moveToInbox, moveToTrash]
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    Options
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                    <div className="py-1">
                        {/* Reply / Forward */}
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#"
                                    className='hover:bg-gray-100 text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm'
                                >
                                    <ReplyIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                    Reply
                                </a>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#"
                                    className='hover:bg-gray-100 text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm'
                                >
                                    <ArrowRightIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                    Forward
                                </a>
                            )}
                        </Menu.Item>
                    </div>

                    {/* Move actions */}
                    <div className="py-1">
                        {moveToFolder[props.selectedFolder].map((folder) => (
                            <Menu.Item>
                                <a
                                    href="#"
                                    className='hover:bg-gray-100 text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm'
                                >
                                    {folder.icon}
                                    {folder.text}
                                </a>
                            </Menu.Item>
                        ))}


                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}