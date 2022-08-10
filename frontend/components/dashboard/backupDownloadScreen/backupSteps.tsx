export default function BackupSteps(){
    return (
        <nav aria-label="Progress">
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
                    <span className="text-xs font-semibold tracking-wide uppercase">Backup</span>
                    <span className="text-sm text-gray-500">On device 1, backup your emails to the cloud.</span>
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
                    <span className="text-xs font-semibold tracking-wide uppercase">Download</span>
                    <span className="text-sm text-gray-500">On device 2, download your emails from the cloud.</span>
                  </span>
                    </a>
                </>
            </ol>
        </nav>
    )
}