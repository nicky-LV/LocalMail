/* This example requires Tailwind CSS v2.0+ */
import {useRef, useState} from 'react'
import {Email, FolderName, ScreenEnum} from "../../../types";
import {getFolderEmails} from "../../../utils";
import axios from 'axios';
import Cookies from 'js-cookie';
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/outline";
import SyncSteps from "./syncSteps";
import {AnimatePresence} from "framer-motion";

interface SyncPageProps {
    setScreen: (modalName: ScreenEnum) => void,
    uuid: string
}

export default function SyncPage(props: SyncPageProps){
    const [syncing, setSyncing] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const cancelButtonRef = useRef(null)

    function syncEmails(){
        const emails: Email[] | null = getFolderEmails(props.uuid, FolderName.INBOX)

        try {
            axios.post(`${process.env.NEXT_PUBLIC_API_SCHEME}://${process.env.NEXT_PUBLIC_API_DOMAIN}:${process.env.NEXT_PUBLIC_API_PORT}/syncEmails/${props.uuid}`,
                emails,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('access_token')}`,
                        refresh_token: `${Cookies.get('refresh_token')}`
                    }
                })
                .then(response => {
                    if (response.status == 200){
                        setSuccess(true);
                        setSyncing(false);
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }

        catch (e) {

        }
    }

    return (
        <div className="grid grid-cols-2 divide-x flex-grow">
            {/* Sync */}

            <div className="p-6 flex flex-col justify-between gap-2">
                <AnimatePresence>
                    {!syncing && (
                        <>
                            <div>
                                <h1 className="text-3xl text-black">Sync</h1>
                                <p className="text-gray-500 text-sm mt-2">Sync your device's emails to another device.</p>
                                <SyncSteps />
                            </div>
                        </>)}

                    {syncing && <>
                        <div>
                            <div className="flex flex-row justify-start items-center gap-2">
                                <h1 className="text-3xl text-black">Syncing</h1>
                                <div className="h-1 w-full">
                                    <div className="animate-ping bg-green-200 w-3 h-3 rounded-full absolute" />
                                    <div className="bg-green-300 w-3 h-3 rounded-full absolute" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm mt-2">Emails from your <span className="font-bold">{FolderName.INBOX}, {FolderName.ARCHIVED}, {FolderName.TRASH}</span> folders are being uploaded.</p>
                        </div>
                    </>
                    }
                </AnimatePresence>

                <div className="flex flex-row justify-between">
                    <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        onClick={() => props.setScreem(Moda)}
                    >
                        <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Back to inbox
                    </button>

                    <AnimatePresence>
                        {!syncing && !success && <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            onClick={(e) => {
                                setSyncing(true);
                                window.setTimeout(() => syncEmails())
                            }}
                        >
                            Sync
                            <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                        </button>}
                    </AnimatePresence>
                </div>
            </div>

            {/* Retrieve */}
            <div className="p-6">
                <h1 className="text-3xl text-black">Retrieve</h1>
                <p className="mt-2 text-gray-400 text-sm">Retrieve synced emails.</p>
            </div>
        </div>
    )
}