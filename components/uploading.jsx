export default function Uploading({uploadingItem}){
    return(
        <div className="flex flex-col justify-center items-center gap-3 my-10 w-full">
            <div className="size-20 border-2 border-b-[var(--foreground)] border-b-[var(--primary)] rounded-full animate-spin"></div>
            <p className="font-mono">Uploading {uploadingItem}...</p>
        </div>
    )
}