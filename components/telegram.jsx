export default function Telegram(){
    return(
        <div className="flex z-10 justify-center items-center border border-(--border)/50 transition-all duration-200 hover:pr-7 cursor-pointer p-2 py-2.5 rounded-full shadow-lg shadow-foreground/20 fixed bottom-10 right-10 bg-background/60 backdrop-blur-2xl saturate-200">
            <img src="/telegram.svg" alt="Contact Me" className="size-8 mr-1" />
            <a href="https://t.me/ahietjny" className="absolute inset-0"></a>
        </div>
    )
}