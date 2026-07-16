export default function LoadingPage(){
    return(
        <div className="w-screen h-screen flex justify-center items-center bg-background/50 backdrop-blur-xl saturate-200">
            <div className="flex flex-col justify-center items-center gap-3 my-10">
                <div className="size-20 border-2 border-b-(--primary) rounded-full animate-spin"></div>
                <p className="font-mono">Loading...</p>
            </div>            
        </div>

    )
}