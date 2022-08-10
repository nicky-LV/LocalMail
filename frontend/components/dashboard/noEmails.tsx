import {CollectionIcon} from "@heroicons/react/outline";

export default function NoEmails() {
  return (
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex flex-row gap-2 items-center justify-start text-gray-500">
          <CollectionIcon className="w-6 h-6" />
          <p>Empty</p>
        </div>
      </div>
  )
}
