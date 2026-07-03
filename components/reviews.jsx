export default function Reviews(){
    return(
        <>
            <Review />  
            <Review />          
        </>
    )
}

function Review(){
    return(
        <div className="_AY border border-[var(--border)]/50 rounded-4xl w-80 p-6 flex flex-col gap-4">
            <div className="bg-foreground/7 p-4 rounded-2xl">
                <p>
                   “We had our home’s entire electrical system updated by 
                   Abu Hanifa Installation, and the results were amazing! 
                   The team was professional, efficient, 
                   and the project finished right on schedule.” 
                </p>
            </div>
            <div className="py-4">
                <p className="font-mono">
                    ⭐⭐⭐⭐⭐ 5.0
                </p>
            </div>
        </div>
    )
}