export default function NotFound({page}){
    return(
       <div className="flex flex-col justify-center items-center gap-6">
            <img src="/not-found.svg" className="w-100" alt="NOT_FOUND"  />
            <h1 className="text-center">

                Page : / {page}<br />
                404 | The page you are looking for couldn't be found 

            </h1>        
            <a href="/" className="font-black bg-foreground text-background py-2 px-6 rounded-full">&copy;Abu-Hanifa Installation</a>
        </div> 
    )
}