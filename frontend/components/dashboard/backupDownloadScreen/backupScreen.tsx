/* This example requires Tailwind CSS v2.0+ */
import {useRef, useState} from 'react'
import {API_EMAIL, Email, FolderName, ScreenEnum} from "../../../types";
import {getFolderEmails, sortEmailsByFolder, updateFolderEmails} from "../../../utils";
import axios from 'axios';
import Cookies from 'js-cookie';
import {ArrowLeftIcon, ArrowRightIcon, CloudUploadIcon, CloudDownloadIcon} from "@heroicons/react/outline";
import BackupSteps from "./backupSteps";
import {AnimatePresence} from "framer-motion";
import ImportAlert from "./importAlert";
import BackupError from "./backupError";
import BackupSuccess from "./backupSuccess";
import ImportError from "./importError";
import ImportSuccess from "./importSuccess";

interface BackupScreenProps {
    setScreen: (modalName: ScreenEnum) => void,
    uuid: string
}

export default function BackupScreen(props: BackupScreenProps){
    // todo: add alerts if 0 emails were backed up / downloaded

    const [backupInProgress, setBackupInProgress] = useState<boolean>(false);
    const [backupError, setBackupError] = useState<boolean>(false);
    const [backupSuccess, setBackupSuccess] = useState<boolean>(false);

    const [importInProgress, setImportInProgress] = useState<boolean>(false);
    const [importError, setImportError] = useState<boolean>(false);
    const [importSuccess, setImportSuccess] = useState<boolean>(false);

    const [showSteps, setShowSteps] = useState<boolean>(false);

    const cancelButtonRef = useRef(null)

    function backupEmails(){
        const emails: API_EMAIL[] | null = getFolderEmails(props.uuid, FolderName.INBOX)

        try {
            axios.post(`${process.env.NEXT_PUBLIC_API_SCHEME}://${process.env.NEXT_PUBLIC_API_DOMAIN}:${process.env.NEXT_PUBLIC_API_PORT}/backup/${props.uuid}`,
                emails,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('access_token')}`,
                        refresh_token: `${Cookies.get('refresh_token')}`
                    }
                })
                .then(response => {
                    if (response.status == 200){
                        setBackupSuccess(true);
                        setBackupInProgress(false);
                    }
                })
                .catch(err => {
                    console.log(err)
                    setBackupError(true);
                })
        }

        catch (e) {

        }
    }

    function importEmails(){
        axios.get(`${process.env.NEXT_PUBLIC_API_SCHEME}://${process.env.NEXT_PUBLIC_API_DOMAIN}:${process.env.NEXT_PUBLIC_API_PORT}/getEmails/${props.uuid}?backup=true`,
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                    refresh_token: `${Cookies.get('refresh_token')}`
                }
            })
            .then(response => {
                if (response.status === 200){
                    const emails: API_EMAIL[] = response.data

                    if (emails.length > 0) {
                        const {inboxEmails, archivedEmails, trashedEmails} = sortEmailsByFolder(emails)
                        updateFolderEmails(props.uuid, inboxEmails, FolderName.INBOX);
                        updateFolderEmails(props.uuid, archivedEmails, FolderName.ARCHIVED);
                        updateFolderEmails(props.uuid, trashedEmails, FolderName.TRASH);
                    }

                    setImportSuccess(true);
                    setImportInProgress(false);
                }
            })
            .catch(err => {
                console.log(err)
                setImportError(true);
            })
    }

    return (
        <div className="grid grid-cols-2 divide-x h-full">
            {/* Sync */}
            <div className="flex flex-col justify-between">
                <AnimatePresence>
                    <>
                        <div className="flex flex-col gap-3 pr-6">
                            {!backupError ? <>{!backupInProgress ?
                                    <>
                                        {/* Backup prompt */}
                                        <h1 className="text-4xl font-bold text-black">Backup</h1>
                                        <p className="text-gray-500 text-sm h-16">Upload your device's emails to the
                                            cloud.</p>
                                        <button
                                            id="backupButton"
                                            type="button"
                                            className={`bg-white hover:bg-gray-50 inline-flex gap-3 items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 focus:outline-none h-10`}
                                            onClick={(e) => {
                                                setBackupInProgress(true);
                                                window.setTimeout(() => backupEmails(), 2000);
                                            }}
                                        >Backup
                                            <CloudUploadIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true"/>
                                        </button>
                                        {backupSuccess && <BackupSuccess />}
                                        <div className="my-3">
                                            {!showSteps && <a
                                                href="#"
                                                className="text-blue-500 hover:text-blue-600 text-sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowSteps(true);
                                                }}
                                            >
                                                How do I access my emails on another device?</a>}
                                            {showSteps && <BackupSteps />}
                                        </div>
                                    </>
                                    :
                                    <>
                                        {/* Backup in progress */}
                                        <h1 className="text-4xl font-bold text-black">Backing up...</h1>
                                        <p className="text-gray-500 text-sm h-16">This may take a moment.</p>
                                        <button
                                            type="button"
                                            disabled
                                            className={`bg-white hover:bg-gray-50 inline-flex gap-3 items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 focus:outline-none h-10`}
                                        >
                                            Backing up
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-800"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                        stroke-width="4"></circle>
                                                <path className="opacity-75" fill="currentColor"
                                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </button>
                                        <div className="my-3">
                                            {!showSteps && <a
                                                href="#"
                                                className="text-blue-500 hover:text-blue-600 text-sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowSteps(true);
                                                }}
                                            >
                                                How do I access my emails on another device?</a>}
                                            {showSteps && <BackupSteps />}
                                        </div>
                                    </>
                                }
                                </>
                                :
                                <>
                                    {/* Backup error */}
                                    <h1 className="text-4xl font-bold text-black">Backup failed</h1>
                                    <p className="text-gray-500 text-sm">An unexpected error occurred.</p>
                                    <BackupError />
                                </>
                            }
                        </div>
                    </>
                </AnimatePresence>

                <div className="flex flex-row justify-between">
                    <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        onClick={() => props.setScreen(ScreenEnum.DASHBOARD)}
                    >
                        <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Back to inbox
                    </button>
                </div>
            </div>

            {/* Retrieve */}
            <div className="pl-6 flex flex-col gap-3">
                <AnimatePresence>
                    {!importError ?
                        <>
                            {!importInProgress ?
                                <>
                                    <h1 className="text-4xl font-bold text-black">Import</h1>
                                    <p className="text-gray-500 text-sm h-16">Import your backed-up emails. This will update your inbox.</p>
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none h-10"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setImportInProgress(true);
                                            window.setTimeout(() => importEmails(), 2000);
                                        }}
                                    >
                                        Download
                                        <CloudDownloadIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                                    </button>

                                    {!importSuccess && <ImportAlert />}
                                    {importSuccess && <ImportSuccess />}
                                </>
                                :
                                <>
                                    {/* Download in progress */}
                                    <h1 className="text-4xl font-bold text-black">Downloading...</h1>
                                    <p className="text-gray-500 text-sm h-16">This may take a moment.</p>
                                    <button
                                        type="button"
                                        disabled
                                        className={`bg-white hover:bg-gray-50 inline-flex gap-3 items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 focus:outline-none h-10`}
                                    >
                                        Downloading
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-800"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </button>
                                </>
                            }
                        </>
                        :
                        <>
                            {/* Download error */}
                            <h1 className="text-4xl font-bold text-black">Download failed</h1>
                            <p className="text-gray-500 text-sm">An unexpected error occurred.</p>
                            <ImportError />
                        </>

                    }
                </AnimatePresence>
            </div>
        </div>
    )
}