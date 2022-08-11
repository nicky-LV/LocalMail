interface Props {
    initials: string
}

export default function InitialsIcon(props: Props){
    return (
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-800">
        <span className="text-xs font-medium leading-none text-white">{props.initials}</span>
      </span>
    )
}