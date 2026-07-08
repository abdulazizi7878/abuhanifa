export default function Loading({loadingItem}){
    return(
        <div className="flex flex-col justify-center items-center gap-3 my-10">
            <div className="size-20 border-2 border-b-(--primary) rounded-full animate-spin"></div>
            <p className="font-mono">Loading {loadingItem}...</p>
        </div>
    )
}