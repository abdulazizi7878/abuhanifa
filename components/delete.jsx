export default function DelteLayout({itemName,OnDelete,OnCancel}){
    return(
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-background/20 backdrop-blur-xl">
            <div className="w-11/12 sm:w-auto border border-(--border) bg-foreground/95 rounded-4xl px-6 py-15 flex flex-col justify-center items-center gap-6">
                <div className="w-10/12 border">
                    <p className="text-center text-background text-lg">Are you sure, want to Delete <span className="font-bold">"{itemName}"</span>  ?</p>
                </div>
                <div className="border flex flex-wrap gap-6">
                    <button onClick={OnCancel} className="text-blue-500 px-4 py-1 rounded-4xl bg-blue-500/20 cursor-pointer transition-all duration-300 hover:pr-4">
                       Cancel
                    </button>
                    <button onClick={OnDelete} className="text-red-400 px-4 py-1 text-sm rounded-4xl bg-red-400/20 cursor-pointer transition-all duration-300 hover:pl-4">
                       Delete
                    </button>
                </div>

            </div>
        </div>
    )
}