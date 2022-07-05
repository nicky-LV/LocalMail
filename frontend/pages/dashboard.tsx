import HeaderLogo from "../components/header_with_logo";
import InboxHeader from "../components/dashboard/inboxHeader";
import Folders from "../components/dashboard/folders";
import ListEmails from "../components/dashboard/listEmails";
import {useState} from "react";
import {FolderName} from "../types";

const emails = [
    {
        id: 1,
        subject: "Test subject",
        body: "Test body",
        sender: "this@test.com",
        recipients: [
            {
                uuid: "test_uuid",
                email_address: "test_email_address"
            }
        ],
        datetime: "datetime"
    },
    {
        id: 2,
        subject: "Test subject",
        body: "Test body",
        sender: "this@test.com",
        recipients: [
            {
                uuid: "test_uuid",
                email_address: "test_email_address"
            }
        ],
        datetime: "datetime"
    }
]

export default function Dashboard(){
    const [selectedFolder, setSelectedFolder] = useState<FolderName>(FolderName.INBOX);
    const [selectedEmail, setSelectedEmail] = useState<number | null>(null);

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

                {/* 3-column collapsible grid */}
                <div className="grid grid-cols-6 h-full divide-x">
                    <div className="col-span-1 h-full">
                        <Folders
                            setSelectedFolder={(folder: FolderName) => setSelectedFolder(folder)}
                            selectedFolder={selectedFolder}
                        />
                    </div>
                    
                    <div className="col-span-2 h-full">
                        <ListEmails
                            folder={selectedFolder}
                            emails={emails}
                            setSelectedEmail={(emailId: number) => setSelectedEmail(emailId)}
                        />

                    </div>
                </div>
            </div>

        </div>
    )
}