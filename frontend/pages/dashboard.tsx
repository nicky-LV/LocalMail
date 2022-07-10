import HeaderLogo from "../components/header_with_logo";
import InboxHeader from "../components/dashboard/inboxHeader";
import Folders from "../components/dashboard/folders";
import ListEmails from "../components/dashboard/listEmails";
import {useEffect, useLayoutEffect, useState} from "react";
import {DashboardError, Email, FolderName} from "../types";
import axios from 'axios';
import Cookies from 'js-cookie';
import Router from "next/router";
import EmailPanel from "../components/dashboard/emailPanel";
import {updateFolderEmails, getFolderEmails} from "../utils";

export default function Dashboard(){
    const [selectedFolder, setSelectedFolder] = useState<FolderName>(FolderName.INBOX);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [updateNum, setUpdateNum] = useState<number>(0);

    useLayoutEffect(() => {
        if (Cookies.get('uuid') && Cookies.get('access_token') && Cookies.get('refresh_token')){
            const {uuid, access_token, refresh_token} = Cookies.get()

            axios.get(`${process.env.NEXT_PUBLIC_API_SCHEME}://${process.env.NEXT_PUBLIC_API_DOMAIN}:${process.env.NEXT_PUBLIC_API_PORT}/getEmails/${uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        refresh_token: `${refresh_token}`,
                        uuid: `${uuid}`
                    }
                })
                .then(response => {
                    if (response.status == 200){
                        updateFolderEmails(uuid, response.data, selectedFolder);
                        setUpdateNum((prevState) => prevState + 1)
                    }
                }).catch(error => {
                console.log(error)
            })
        }

        // Return to login page if cookies are not present
        else {
            Router.push('/login')
        }

    }, [])

    return (
        <div className="sm:min-h-screen bg-gray-100">

            <div className="md:block hidden">
                {/* Hide on md (or smaller) viewports */}
                <HeaderLogo />
            </div>

            {/* Card */}
            <div className="max-w-7xl mx-auto md:mt-20 min-h-screen bg-white sm:rounded-tl-lg
            sm:rounded-tr-lg md:border md:shadow-md">
                <InboxHeader />

                {/* 6-column collapsible grid */}
                <div className="grid grid-cols-6 h-full divide-x">
                    <div className="col-span-1 h-full">
                        <Folders
                            setSelectedFolder={(folder: FolderName) => setSelectedFolder(folder)}
                            selectedFolder={selectedFolder}
                            clearSelectedEmail={() => setSelectedEmail(null)}
                        />
                    </div>

                    {/* List emails */}
                    <div className="col-span-2 h-full">
                        <ListEmails
                            key={selectedFolder + updateNum.toString()}
                            folder={selectedFolder}
                            uuid={Cookies.get('uuid')}
                            setSelectedEmail={(email: Email) => setSelectedEmail(email)}
                        />
                    </div>

                    {/* Email panel */}
                    <div className="col-span-3 h-full">
                        {selectedEmail != null && <EmailPanel
                            updateEmailList={() => setUpdateNum(prevState => prevState + 1)}
                            email={selectedEmail}
                            uuid={Cookies.get('uuid')}
                            selectedFolder={selectedFolder}
                            setSelectedEmail={setSelectedEmail}
                        />}
                    </div>
                </div>
            </div>

        </div>
    )
}