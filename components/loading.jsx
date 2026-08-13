export default function Loading({ loadingItem }) {
    return (
        <div className="flex flex-col justify-center items-center gap-4 my-16 w-full">
            <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-(--border) border-t-(--primary) animate-spin" />
                <div className="absolute w-8 h-8 rounded-full bg-(--primary)/10 blur-sm animate-pulse" />
            </div>
            <p className="text-sm font-medium tracking-wide text-(--foreground) opacity-70 animate-pulse">
                Loading {loadingItem || "data"}...
            </p>
        </div>
    );
}