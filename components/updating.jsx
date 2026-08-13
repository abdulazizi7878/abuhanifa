export default function Updating({ Updating_item }) {
    return (
        <div className="flex flex-col justify-center items-center gap-4 my-12 p-8 bg-foreground/[0.02] border border-(--border) backdrop-blur-md rounded-3xl shadow-xl max-w-sm mx-auto">
            <div className="relative flex items-center justify-center">
                <div className="absolute size-20 rounded-full bg-(--primary)/10 animate-ping"></div>
                <div className="size-20 border-3 border-(--border) border-t-(--primary) rounded-full animate-spin shadow-sm"></div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <p className="font-mono text-sm font-bold tracking-wider text-foreground">
                    Updating <span className="text-(--primary)">{Updating_item}</span>...
                </p>
                <span className="text-xs text-foreground/50">Please wait while we save your changes</span>
            </div>
        </div>
    );
}