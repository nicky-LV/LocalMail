export default function HeaderLogo(props: any){
    return (
        <div id="headerLogo" className="bg-gray-700 h-20 flex flex-row items-center px-16">
                <div id="Logo" className="bg-red">Logo</div>
            {props.children && <div id='buttons-container' className="w-full flex flex-row justify-end gap-6">
                {/* Buttons */}
                {props.children}
            </div>}
        </div>
    )
}