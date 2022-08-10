import HeaderLogo from "../components/header_with_logo";
import InboxHeader from "../components/dashboard/inboxHeader";
import Folders from "../components/dashboard/folders";
import ListEmails from "../components/dashboard/listEmails";
import {useEffect, useState} from "react";
import {API_EMAIL, Email, FolderName, ScreenEnum} from "../types";
import axios from 'axios';
import Cookies from 'js-cookie';
import ShowEmail from "../components/dashboard/showEmailScreen/showEmail";
import {updateFolderEmails} from "../utils";
import AuthRequired from "../components/authRequired";
import {useRouter} from "next/router";
import {AnimatePresence, motion} from "framer-motion";
import BackupScreen from "../components/dashboard/backupDownloadScreen/backupScreen";

interface DashboardProps {
    emails: Email[],
    uuid: string,
    accessToken: string,
    refreshToken: string
}

const fadeInVariant = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0}
}

const slideUpVariant = {
    initial: {marginTop: "100%"},
    animate: {
        marginTop: "6rem",
        transition: {
            duration: 1,
            staggerChildren: 0.5,
            delayChildren: 1
        }
    }
}

export default function AuthDashboard(props: any){
    return (
        <AuthRequired>
            <Dashboard
                emails={props.emails}
                uuid={props.uuid}
                accessToken={props.accessToken}
                refreshToken={props.refreshToken}
            />
        </AuthRequired>
    )
}

function Dashboard(props: DashboardProps){
    const [selectedFolder, setSelectedFolder] = useState<FolderName>(FolderName.INBOX);
    const [selectedEmail, setSelectedEmail] = useState<API_EMAIL | null>(null);
    const [updateNum, setUpdateNum] = useState<number>(0);
    const [emailAddress, setEmailAddress] = useState<string>("");
    const [screen, setScreen] = useState<ScreenEnum | null>(null);

    const router = useRouter();

    useEffect(() => {
        /** Retrieve any new emails and push them to localStorage. **/
        try {
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
                    if (response.status == 200) {
                        const {email_address, data} = response.data
                        setEmailAddress(email_address)

                        let inboxEmails: API_EMAIL[] = []
                        let archivedEmails: API_EMAIL[] = []
                        let trashedEmails: API_EMAIL[] = []

                        data.forEach((email: API_EMAIL) => {
                            switch (email.folder){
                                case FolderName.INBOX:
                                    inboxEmails.push(email)
                                    break;

                                case FolderName.ARCHIVED:
                                    archivedEmails.push(email)
                                    break;

                                case FolderName.TRASH:
                                    trashedEmails.push(email)
                                    break;
                            }
                        })
                        updateFolderEmails(props.uuid, inboxEmails, FolderName.INBOX);
                        updateFolderEmails(props.uuid, archivedEmails, FolderName.ARCHIVED);
                        updateFolderEmails(props.uuid, trashedEmails, FolderName.TRASH);
                        setUpdateNum(prevState => prevState + 1);
                    }
                }).catch(() => {
                router.push('/login')
            })
        }
        catch (e) {
            router.push('/login')
        }
    }, [])

    return (
        <div className="flex flex-col h-screen bg-gray-700">
            <div className="md:block hidden">
                {/* Hide on md (or smaller) viewports */}
                <HeaderLogo />
            </div>

            {/* Card */}
            <AnimatePresence>
                <motion.div className="flex flex-grow mx-96 mx-auto bg-white sm:rounded-tl-lg
            sm:rounded-tr-lg md:border md:shadow-md"
                            variants={slideUpVariant}
                            initial='initial'
                            animate='animate'
                >
                    <section className="flex flex-col flex-grow">
                        <InboxHeader
                            uuid={props.uuid}
                            emailAddress={emailAddress}
                            setModal={(modal: ScreenEnum) => setScreen(modal)}/>

                        <AnimatePresence exitBeforeEnter>
                            {/* 6-column collapsible grid */}
                            {screen === null && <motion.div
                                className="grid grid-cols-6 divide-x"
                                variants={fadeInVariant}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >

                                {/* Folders column */}
                                <motion.div
                                    className="col-span-1"
                                    id="col-1"
                                    variants={fadeInVariant}
                                >
                                    <Folders
                                        uuid={props.uuid}
                                        setSelectedFolder={(folder: FolderName) => setSelectedFolder(folder)}
                                        selectedFolder={selectedFolder}
                                        clearSelectedEmail={() => setSelectedEmail(null)}
                                    />
                                </motion.div>

                                {/* List emails */}

                                <div
                                    className="col-span-2"
                                >
                                    <AnimatePresence exitBeforeEnter>
                                        <motion.div
                                            id='col-2'
                                            key={selectedFolder + updateNum.toString()}
                                            variants={fadeInVariant}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                        >
                                            <ListEmails
                                                key={selectedFolder + updateNum.toString()}
                                                folder={selectedFolder}
                                                uuid={Cookies.get('uuid')}
                                                setSelectedEmail={(email: API_EMAIL) => setSelectedEmail(email)}
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Email panel */}
                                <div className="col-span-3" id="col-3">
                                    <motion.div
                                        id='col-3'
                                        variants={fadeInVariant}
                                    >
                                        <ShowEmail
                                            updateEmailList={() => setUpdateNum(prevState => prevState + 1)}
                                            email={selectedEmail}
                                            uuid={Cookies.get('uuid')}
                                            selectedFolder={selectedFolder}
                                            setSelectedEmail={setSelectedEmail}
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>}

                            {screen === ScreenEnum.BACKUP_SCREEN && <BackupScreen setScreen={(screen: ScreenEnum) => setScreen(screen)} uuid={props.uuid} />}

                        </AnimatePresence>
                    </section>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}