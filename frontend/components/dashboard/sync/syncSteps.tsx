import { CheckIcon } from '@heroicons/react/solid'

const steps = [


    { name: 'Create account', description: 'Vitae sed mi luctus laoreet.', href: '#', status: 'complete' },
    {
        name: 'Profile information',
        description: 'Cursus semper viverra facilisis et et some more.',
        href: '#',
        status: 'current',
    }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SyncSteps(){
    return (
        <nav aria-label="Progress" className="mt-8">
            <p className="text-xs text-gray-500 my-2 uppercase">Steps</p>
            <ol role="list" className="overflow-hidden flex flex-col gap-6">
                <>

                    <a className="relative flex items-start group">
                  <span className="h-9 flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center text-black text-bold bg-gray-200 rounded-full">
                      1
                    </span>
                  </span>
                        <span className="ml-4 min-w-0 flex flex-col">
                    <span className="text-xs font-semibold tracking-wide uppercase">Sync your emails</span>
                    <span className="text-sm text-gray-500">Upload local emails to the cloud.</span>
                  </span>
                    </a>
                </>

                <>

                    <a className="relative flex items-start group">
                  <span className="h-9 flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center text-black text-bold bg-gray-200 rounded-full">
                      2
                    </span>
                  </span>
                        <span className="ml-4 min-w-0 flex flex-col">
                    <span className="text-xs font-semibold tracking-wide uppercase">Retrieve</span>
                    <span className="text-sm text-gray-500">On another device, retrieve your synced emails.</span>
                  </span>
                    </a>
                </>
            </ol>
        </nav>
    )
}