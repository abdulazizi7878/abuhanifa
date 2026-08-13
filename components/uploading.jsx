export default function Uploading({ uploadingItem }) {
    return (
        <div className="flex flex-col justify-center items-center gap-4 my-12 p-8 bg-foreground/[0.02] border border-(--border) backdrop-blur-md rounded-3xl shadow-xl w-full max-w-sm mx-auto">
            <div className="relative flex items-center justify-center">
                <div className="absolute size-20 rounded-full bg-(--primary)/10 animate-ping"></div>
                <div className="size-20 border-3 border-(--border) border-b-(--primary) rounded-full animate-spin shadow-sm"></div>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-mono text-sm font-bold tracking-wider text-foreground">
                    Uploading <span className="text-(--primary)">{uploadingItem}</span>...
                </p>
                <span className="text-xs text-foreground/50">Please wait while your files are being uploaded</span>
            </div>
        </div>
    );
}