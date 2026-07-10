export default function ImageViewer({imageSrc,OnClick}){
    return(
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-black/90 flex justify-center items-center">
            <img src={imageSrc} alt="IMAGE_VIEWER" className="brightness-90 rounded-4xl w-11/12 md:w-10/12" loading="lazy" />
            <button onClick={OnClick} className="absolute top-4 left-4 bg-white shadow-2xl p-2 rounded-4xl cursor-pointer transition-all duration-300 hover:pl-4">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                     <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
            </button>
        </div>
    )
}