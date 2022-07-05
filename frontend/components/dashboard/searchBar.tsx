export default function SearchBar(){
    return (
            <div className="flex items-center">
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search..."
                    className="border text-black h-full w-full block w-full p-2 rounded-lg sm:text-sm
                    focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                />
            </div>
    )
}