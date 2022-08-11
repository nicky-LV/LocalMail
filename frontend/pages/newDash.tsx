import {Fragment, useEffect, useState} from 'react'
import {Menu, Popover, Transition} from '@headlessui/react'
import {BellIcon, MenuIcon, RefreshIcon, XIcon} from '@heroicons/react/outline'
import {SearchIcon} from '@heroicons/react/solid'
import {API_EMAIL, FolderName, ScreenEnum} from "../types";
import ListEmails from "../components/dashboard/listEmails";
import Cookies from 'js-cookie';
import DashboardActions from "../components/dashboard/actions/dashboardActions";
import {AnimatePresence, motion} from "framer-motion";
import AuthRequired from "../components/authRequired";
import BackupScreen from "../components/dashboard/backupDownloadScreen/backupScreen";
import {useRouter} from "next/router";
import axios from "axios";
import {sortEmailsByFolder, updateFolderEmails} from "../utils";
import ShowEmail from "../components/dashboard/showEmailScreen/showEmail";
import CheckedEmailsActions from "../components/dashboard/actions/checkedEmailsActions";

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const fadeInVariant = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0}
}

const folders = [
    FolderName.INBOX,
    FolderName.ARCHIVED,
    FolderName.SPAM,
    FolderName.TRASH
]

export default function AuthDashboard(props: any){
    return (
        <AuthRequired>
            <NewDash
                emails={props.emails}
                uuid={props.uuid}
                accessToken={props.accessToken}
                refreshToken={props.refreshToken}
            />
        </AuthRequired>
    )
}

function NewDash(props: any) {
    // Current folder
    const [selectedFolder, setSelectedFolder] = useState<FolderName>(FolderName.INBOX);
    // Current opened email
    const [openedEmail, setOpenedEmail] = useState<API_EMAIL | null>(null);
    // Emails that have been checked. Array of email IDs.
    const [selectedEmails, selectEmail] = useState<number[]>([]);
    // Screen that the dashboard should display
    const [screen, setScreen] = useState<ScreenEnum>(ScreenEnum.DASHBOARD);
    // Name & email address of user
    const [userName, setUserName] = useState<string>("");
    const [emailAddress, setEmailAddress] = useState<string>("");
    // counterDep
    const [counterDep, setCounterDep] = useState<number>(0);

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
                        const {name, email_address, data} = response.data;
                        setUserName(name)
                        setEmailAddress(email_address)

                        const {inboxEmails, archivedEmails, trashedEmails} = sortEmailsByFolder(data)
                        updateFolderEmails(props.uuid, inboxEmails, FolderName.INBOX);
                        updateFolderEmails(props.uuid, archivedEmails, FolderName.ARCHIVED);
                        updateFolderEmails(props.uuid, trashedEmails, FolderName.TRASH);

                        // todo: refresh ListEmails once localStorage updated
                    }
                }).catch((e) => {
                console.log(e)
                router.push('/login')
            })
        }
        catch (e) {
            console.log(e)
            router.push('/login')
        }
    }, [counterDep])

    function resetSelectedEmails(){
        selectEmail(() => [])
    }

    return (
        <>
            <div className="flex flex-col h-screen pb-8 overflow-hidden">
                <Popover as="header" className="bg-gray-800">
                    {({ open }) => (
                        <>
                            <div className="max-w-3xl h-full mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                                <div className="relative py-5 flex items-center justify-center lg:justify-between">
                                    {/* Logo */}
                                    <div className="absolute left-0 flex-shrink-0 lg:static">
                                        <a href="#">
                                            <span className="sr-only">Workflow</span>
                                            <img
                                                className="h-8 w-auto"
                                                src="https://tailwindui.com/img/logos/workflow-mark-indigo-300.svg"
                                                alt="Workflow"
                                            />
                                        </a>
                                    </div>

                                    {/* Right section on desktop */}
                                    <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                                        {/* Profile dropdown */}
                                        <Menu as="div" className="ml-4 relative flex-shrink-0 flex flex-col">
                                            <p className="text-xs text-gray-300">Signed in as </p>
                                            <p className="text-sm text-white font-bold">{emailAddress}</p>
                                        </Menu>
                                    </div>

                                    {/* Search */}
                                    <div className="flex-1 min-w-0 px-12 lg:hidden">
                                        <div className="max-w-xs w-full mx-auto">
                                            <label htmlFor="desktop-search" className="sr-only">
                                                Search
                                            </label>
                                            <div className="relative text-white focus-within:text-gray-600">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <input
                                                    id="desktop-search"
                                                    className="block w-full bg-white bg-opacity-20 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-white focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                                                    placeholder="Search"
                                                    type="search"
                                                    name="search"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu button */}
                                    <div className="absolute right-0 flex-shrink-0 lg:hidden">
                                        {/* Mobile menu button */}
                                        <Popover.Button className="bg-transparent p-2 rounded-md inline-flex items-center justify-center text-indigo-200 hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Popover.Button>
                                    </div>
                                </div>
                                <div className="hidden lg:block border-t border-white border-opacity-20 py-5">
                                    <div className="grid grid-cols-3 gap-8 items-center">
                                        <div className="col-span-2">
                                            <nav className="flex space-x-4">
                                                {folders.map((folder) => (
                                                    <a
                                                        key={folder}
                                                        href={"#"}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            resetSelectedEmails()
                                                            setSelectedFolder(folder);
                                                            setOpenedEmail(null);
                                                        }}
                                                        className={`${selectedFolder === folder ? 'text-white' : 'text-gray-300'} text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10`}
                                                    >
                                                        {folder}
                                                    </a>
                                                ))}
                                            </nav>
                                        </div>
                                        <div>
                                            <div className="max-w-md w-full mx-auto">
                                                <label htmlFor="mobile-search" className="sr-only">
                                                    Search
                                                </label>
                                                <div className="relative text-white focus-within:text-gray-600">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                                        <SearchIcon className="h-5 w-5" aria-hidden="true" />
                                                    </div>
                                                    <input
                                                        id="mobile-search"
                                                        className="block w-full bg-white bg-opacity-20 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-white focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                                                        placeholder="Search"
                                                        type="search"
                                                        name="search"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Transition.Root as={Fragment}>
                                <div className="lg:hidden">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="duration-150 ease-out"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="duration-150 ease-in"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Popover.Overlay className="z-20 fixed inset-0 bg-black bg-opacity-25" />
                                    </Transition.Child>

                                    <Transition.Child
                                        as={Fragment}
                                        enter="duration-150 ease-out"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="duration-150 ease-in"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Popover.Panel
                                            focus
                                            className="z-30 absolute top-0 inset-x-0 max-w-3xl mx-auto w-full p-2 transition transform origin-top"
                                        >
                                            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200">
                                                <div className="pt-3 pb-2">
                                                    <div className="flex items-center justify-between px-4">
                                                        <div>
                                                            <img
                                                                className="h-8 w-auto"
                                                                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                                                alt="Workflow"
                                                            />
                                                        </div>
                                                        <div className="-mr-2">
                                                            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                                                <span className="sr-only">Close menu</span>
                                                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                                            </Popover.Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-4 pb-2">
                                                    <div className="flex items-center px-5">
                                                        <div className="flex-shrink-0">
                                                            <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                                                        </div>
                                                        <div className="ml-3 min-w-0 flex-1">
                                                            <div className="text-base font-medium text-gray-800 truncate">{userName}</div>
                                                            <div className="text-sm font-medium text-gray-500 truncate">{emailAddress}</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 px-2 space-y-1">
                                                        {/** todo: Mobile nav items **/}
                                                    </div>
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition.Child>
                                </div>
                            </Transition.Root>
                        </>
                    )}
                </Popover>
                <main className="bg-gray-800 pb-8">
                    <div className="max-w-3xl mx-auto px-4 h-full sm:px-6 lg:max-w-7xl lg:px-8">
                        <h1 className="sr-only">Page title</h1>
                        {/* Main 3 column grid */}
                        <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8 h-full">
                            {/* Left column */}
                            <div className="grid grid-cols-1 gap-4 lg:col-span-2 h-full">
                                <section aria-labelledby="section-1-title">
                                    <h2 className="sr-only" id="section-1-title">
                                        Section title
                                    </h2>

                                    {/* Content */}
                                    <div className="rounded-lg bg-white shadow h-full p-6">
                                        <AnimatePresence exitBeforeEnter>
                                            {screen === ScreenEnum.DASHBOARD && !openedEmail && <motion.div
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                variants={fadeInVariant}
                                                className="flex flex-col gap-3 h-full">
                                                <div className="flex flex-row justify-between">

                                                    <div className="flex flex-row gap-3 items-center justify-start">
                                                        {/* Selected folder */}
                                                        <h1 className="text-4xl font-bold text-black">{selectedFolder}</h1>

                                                        {/* Refresh inbox */}
                                                        {/* todo: spin when clicked */}
                                                        <button className="mt-2" onClick={() => setCounterDep((prevState) => prevState + 1)}>
                                                            <RefreshIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
                                                        </button>
                                                    </div>

                                                    {/* DashboardActions for checked emails */}
                                                    {selectedEmails.length > 0 && <CheckedEmailsActions
                                                        uuid={props.uuid}
                                                        selectedFolder={selectedFolder} />
                                                    }
                                                </div>
                                                <ListEmails
                                                    key={selectedFolder}
                                                    folder={selectedFolder}
                                                    uuid={Cookies.get('uuid')}
                                                    setOpenedEmail={(email: API_EMAIL) => setOpenedEmail(email)}
                                                    selectEmail={(emailId: number) => selectEmail((prevState) => prevState.concat(emailId))}
                                                    deselectEmail={(emailId: number) => selectEmail((prevState) => prevState.filter((value) => value !== emailId))}
                                                />
                                            </motion.div>}

                                            {screen === ScreenEnum.DASHBOARD && openedEmail &&
                                                <motion.div
                                                    className="h-full"
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                    variants={fadeInVariant}
                                                >
                                                    <ShowEmail
                                                        email={openedEmail}
                                                        uuid={props.uuid}
                                                        selectedFolder={selectedFolder}
                                                        setSelectedEmail={setOpenedEmail}
                                                    />
                                                </motion.div>}

                                            {screen === ScreenEnum.BACKUP_SCREEN && <BackupScreen setScreen={(screen) => setScreen(screen)} uuid={props.uuid} />}
                                        </AnimatePresence>
                                    </div>
                                </section>
                            </div>

                            {/* Right column */}
                            <div className="grid grid-cols-1 gap-4">
                                <section aria-labelledby="section-2-title">
                                    <h2 className="sr-only" id="section-2-title">
                                        Section title
                                    </h2>
                                    <div className="rounded-lg bg-white overflow-hidden shadow">
                                        <div>
                                            <DashboardActions setScreen={(screen: ScreenEnum) => setScreen(screen)} />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
