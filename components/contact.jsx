"use client"

import { useState } from "react";
import Uploading from "./uploading";
import { useTranslations } from "next-intl";

export default function ContactPage(){

    const t = useTranslations("contact");

    const [uploading, setUploading] = useState(false);

    async function sendEmail() {

        setUploading(true);

        let name = document.querySelector("#name");
        let email = document.querySelector("#email");
        let message = document.querySelector("textarea")

        try {
            const response = await fetch("/api/contact",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                    message: message.value
                })
            })            
            const res = await response.json();
            if(res.success){ 
                alert("email sent successfuly");  
                location.reload();
            } else {
                alert(res.message);
            }
            
            setUploading(false);
        } catch(err){
            setUploading(false);
        }

    }

    return(
        <div className="w-full flex flex-col justify-start items-center">
            <div className="w-11/12 flex flex-col justify-center items-start gap-10">

                 <div className="w-full">
                    <div>
                        <h1 className="text-3xl font-black">{t("Contact us Today")}</h1>    
                        <p className="text-md my-2">{t("To contact by Email")}</p>
                    </div>
                    <div className="w-full flex flex-col justify-center items-start gap-6">

                        <input type="text" className="border border-(--border) duration-300 hover:px-12 hover:shadow-xl px-10 py-4 rounded-4xl outline-(--primary) max-w-11/12" placeholder={t("Name")} title="Please Enter Your Name!" autoComplete="name" id="name" />
                        <input type="email" className="border border-(--border) duration-300 hover:px-12 hover:shadow-xl px-10 py-4 rounded-4xl outline-(--primary) max-w-11/12" placeholder={t("Email")} title="Please Enter Your Email!" autoComplete="email" id="email" />
                        <textarea  className="border border-(--border) duration-300 hover:px-12 hover:shadow-xl px-10 py-4 rounded-4xl outline-(--primary) h-70 w-full sm:w-full md:w-10/12" placeholder={t("Leave Message")} title="Contact box, leave something comment, order, review, job, Advertisement..." >
                        </textarea>
                        {uploading && <Uploading uploadingItem="email" />}
                        <button className="bg-foreground text-background px-10 py-4 rounded-4xl cursor-pointer duration-300 hover:px-11 hover:shadow-xl" onClick={sendEmail}>
                            {t("Send")} 
                        </button>
                    </div>
                 </div>



                 <div className="w-full flex flex-col gap-10">
                    <div>
                        <p className="text-md text-2xl font-black my-2">{t("Other options")}</p>
                    </div>
                    <div className="border border-(--border) flex flex-col justify-center items-center gap-10 h-60 rounded-4xl">

                        <div className="flex justify-center gap-x-6 w-full overflow-scroll pl-20 md:p-0 sm:p-0">

                            <div onClick={()=>{
                                window.location.href = "https://www.instagram.com/nurye3107?igsh=aHFncm13YnVwNDMz"
                            }} 
                            className="relative flex flex-col justify-center items-center gap-4 w-20 h-24 cursor-pointer duration-300 hover:*:not-first:top-0 hover:*:not-first:bg-orange-600 hover:*:not-first:text-white hover:*:not-last:px-10 hover:*:not-last:pr-2">

                                    <div className="rounded-full  py-1.5 px-2 duration-300 pr-6 bg-orange-600">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z"></path>
                                        </svg>
                                    </div> 

                                    <div className="transition-all duration-300 absolute bottom-0 h-fit px-4 rounded-2xl">
                                        <span className="text-sm">{t("Instagram")}</span>
                                    </div>
                                    
                                </div>

                                <div onClick={()=>{
                                                    window.location.href = "https://tiktok.com/@ahieth"
                                                }} 
                                className="relative flex flex-col justify-center items-center gap-4 w-20 h-24 cursor-pointer duration-300 hover:*:not-first:top-0 hover:*:not-first:bg-black hover:*:not-first:text-white hover:*:not-last:px-10 hover:*:not-last:pr-2">

                                    <div className="rounded-full  py-1.5 px-2 duration-300 pr-6 bg-black">
                                        <svg width="20" height="20" viewBox="0 0 32 32" fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <path d="M16.708 0.027c1.745-0.027 3.48-0.011 5.213-0.027 0.105 2.041 0.839 4.12 2.333 5.563 1.491 1.479 3.6 2.156 5.652 2.385v5.369c-1.923-0.063-3.855-0.463-5.6-1.291-0.76-0.344-1.468-0.787-2.161-1.24-0.009 3.896 0.016 7.787-0.025 11.667-0.104 1.864-0.719 3.719-1.803 5.255-1.744 2.557-4.771 4.224-7.88 4.276-1.907 0.109-3.812-0.411-5.437-1.369-2.693-1.588-4.588-4.495-4.864-7.615-0.032-0.667-0.043-1.333-0.016-1.984 0.24-2.537 1.495-4.964 3.443-6.615 2.208-1.923 5.301-2.839 8.197-2.297 0.027 1.975-0.052 3.948-0.052 5.923-1.323-0.428-2.869-0.308-4.025 0.495-0.844 0.547-1.485 1.385-1.819 2.333-0.276 0.676-0.197 1.427-0.181 2.145 0.317 2.188 2.421 4.027 4.667 3.828 1.489-0.016 2.916-0.88 3.692-2.145 0.251-0.443 0.532-0.896 0.547-1.417 0.131-2.385 0.079-4.76 0.095-7.145 0.011-5.375-0.016-10.735 0.025-16.093z"></path>
                                        </svg>   
                                    </div> 

                                    <div className="transition-all duration-300 absolute bottom-0 h-fit px-4 rounded-2xl">
                                        <span className="text-sm">{t("TikTok")}</span>
                                    </div>
                                    
                                </div>

                                <div onClick={()=>{
                                                    window.location.href = "https://youtube.com/@ahieth"
                                                }} 
                                className="relative flex flex-col justify-center items-center gap-4 w-20 h-24 cursor-pointer duration-300 hover:*:not-first:top-0 hover:*:not-first:bg-red-600 hover:*:not-first:text-white hover:*:not-last:px-10 hover:*:not-last:pr-2">

                                    <div className="rounded-full  py-1.5 px-2 duration-300 pr-6 bg-red-600">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <path d="M21.8,8.001c0,0-0.195-1.378-0.795-1.985c-0.76-0.797-1.613-0.801-2.004-0.847c-2.799-0.202-6.997-0.202-6.997-0.202 h-0.009c0,0-4.198,0-6.997,0.202C4.608,5.216,3.756,5.22,2.995,6.016C2.395,6.623,2.2,8.001,2.2,8.001S2,9.62,2,11.238v1.517 c0,1.618,0.2,3.237,0.2,3.237s0.195,1.378,0.795,1.985c0.761,0.797,1.76,0.771,2.205,0.855c1.6,0.153,6.8,0.201,6.8,0.201 s4.203-0.006,7.001-0.209c0.391-0.047,1.243-0.051,2.004-0.847c0.6-0.607,0.795-1.985,0.795-1.985s0.2-1.618,0.2-3.237v-1.517 C22,9.62,21.8,8.001,21.8,8.001z M9.935,14.594l-0.001-5.62l5.404,2.82L9.935,14.594z"></path>
                                        </svg>
                                    </div> 

                                    <div className="transition-all duration-300 absolute bottom-0 h-fit px-4 rounded-2xl">
                                        <span className="text-sm">{t("YouTube")}</span>
                                    </div>
                                    
                                </div>

                                <div onClick={()=>{
                                                    window.location.href = "https://www.facebook.com/profile.php?id=61587213729895"
                                                }} 
                                className="relative flex flex-col justify-center items-center gap-4 w-20 h-24 cursor-pointer duration-300 hover:*:not-first:top-0 hover:*:not-first:bg-blue-500 hover:*:not-first:text-white hover:*:not-last:px-10 hover:*:not-last:pr-2">

                                    <div className="rounded-full  py-1.5 px-2 duration-300 pr-6 bg-blue-500">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z"></path>
                                        </svg> 
                                    </div> 

                                    <div className="transition-all duration-300 absolute bottom-0 h-fit px-4 rounded-2xl">
                                        <span className="text-sm">{t("Facebook")}</span>
                                    </div>
                                    
                                </div>

                                <div onClick={()=>{
                                                    window.location.href = "https://t.me/ahietjny"
                                                }} 
                                className="relative flex flex-col justify-center items-center gap-4 w-20 h-24 cursor-pointer duration-300 hover:*:not-first:top-0 hover:*:not-first:bg-blue-400 hover:*:not-first:text-white hover:*:not-last:px-10 hover:*:not-last:pr-2">

                                    <div className="rounded-full  py-1.5 px-2 duration-300 pr-6 bg-blue-400">
                                        <svg width="24" height="24" viewBox="0 0 128 128" fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <path d="M28.9700376,63.3244248 C47.6273373,55.1957357 60.0684594,49.8368063 66.2934036,47.2476366 C84.0668845,39.855031 87.7600616,38.5708563 90.1672227,38.528 C90.6966555,38.5191258 91.8804274,38.6503351 92.6472251,39.2725385 C93.294694,39.7979149 93.4728387,40.5076237 93.5580865,41.0057381 C93.6433345,41.5038525 93.7494885,42.63857 93.6651041,43.5252052 C92.7019529,53.6451182 88.5344133,78.2034783 86.4142057,89.5379542 C85.5170662,94.3339958 83.750571,95.9420841 82.0403991,96.0994568 C78.3237996,96.4414641 75.5015827,93.6432685 71.9018743,91.2836143 C66.2690414,87.5912212 63.0868492,85.2926952 57.6192095,81.6896017 C51.3004058,77.5256038 55.3966232,75.2369981 58.9976911,71.4967761 C59.9401076,70.5179421 76.3155302,55.6232293 76.6324771,54.2720454 C76.6721165,54.1030573 76.7089039,53.4731496 76.3346867,53.1405352 C75.9604695,52.8079208 75.4081573,52.921662 75.0095933,53.0121213 C74.444641,53.1403447 65.4461175,59.0880351 48.0140228,70.8551922 C45.4598218,72.6091037 43.1463059,73.4636682 41.0734751,73.4188859 C38.7883453,73.3695169 34.3926725,72.1268388 31.1249416,71.0646282 C27.1169366,69.7617838 23.931454,69.0729605 24.208838,66.8603276 C24.3533167,65.7078514 25.9403832,64.5292172 28.9700376,63.3244248 Z"></path>
                                        </svg>    
                                    </div> 

                                    <div className="transition-all duration-300 absolute bottom-0 h-fit px-4 rounded-2xl">
                                        <span className="text-sm">{t("Telegram")}</span>
                                    </div>
                                    
                                </div>                            
                        </div>

                        <div className="flex px-6 py-2 duration-300 hover:px-8 rounded-4xl bg-blue-400 cursor-pointer" onClick={()=>{window.location.href ="https://t.me/ahieth";}} >
                            <span className="text-background">
                               {t("Join our Telegram channel")}  
                            </span>
                            <div className="px-2 rounded-2xl">
                                <svg width="24" height="24" viewBox="0 0 128 128" fill="blue" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                    <path d="M28.9700376,63.3244248 C47.6273373,55.1957357 60.0684594,49.8368063 66.2934036,47.2476366 C84.0668845,39.855031 87.7600616,38.5708563 90.1672227,38.528 C90.6966555,38.5191258 91.8804274,38.6503351 92.6472251,39.2725385 C93.294694,39.7979149 93.4728387,40.5076237 93.5580865,41.0057381 C93.6433345,41.5038525 93.7494885,42.63857 93.6651041,43.5252052 C92.7019529,53.6451182 88.5344133,78.2034783 86.4142057,89.5379542 C85.5170662,94.3339958 83.750571,95.9420841 82.0403991,96.0994568 C78.3237996,96.4414641 75.5015827,93.6432685 71.9018743,91.2836143 C66.2690414,87.5912212 63.0868492,85.2926952 57.6192095,81.6896017 C51.3004058,77.5256038 55.3966232,75.2369981 58.9976911,71.4967761 C59.9401076,70.5179421 76.3155302,55.6232293 76.6324771,54.2720454 C76.6721165,54.1030573 76.7089039,53.4731496 76.3346867,53.1405352 C75.9604695,52.8079208 75.4081573,52.921662 75.0095933,53.0121213 C74.444641,53.1403447 65.4461175,59.0880351 48.0140228,70.8551922 C45.4598218,72.6091037 43.1463059,73.4636682 41.0734751,73.4188859 C38.7883453,73.3695169 34.3926725,72.1268388 31.1249416,71.0646282 C27.1169366,69.7617838 23.931454,69.0729605 24.208838,66.8603276 C24.3533167,65.7078514 25.9403832,64.5292172 28.9700376,63.3244248 Z"></path>
                                </svg> 
                            </div>  
                        </div>                        
                    </div>

                    <div className="w-full flex flex-col items-center justify-center gap-4 my-6">

                        <div className="flex justify-center items-center gap-2 relative w-full">
                            <div className="px-4 py-1 bg-foreground text-background rounded-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="bg-foreground rounded-2xl" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--background)">
                                    <path  d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/>
                                </svg>                                
                            </div>
                            <span className="px-4 py-1 bg-foreground text-background rounded-2xl">
                                +2519 - 3648 - 9696
                            </span>
                            <a href="tel:+251936489696" className="absolute inset-0"></a>
                        </div>

                        <div className="flex justify-center gap-2 relative w-full">
                            <div className="px-4 py-1 bg-foreground text-background rounded-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="bg-foreground rounded-2xl" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--background)">
                                    <path  d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/>
                                </svg>                                
                            </div>

                            <span className="px-4 py-1 bg-foreground text-background rounded-2xl">
                                +2517 - 0548 - 9696
                            </span>
                            <a href="tel:+251705489696" className="absolute inset-0"></a>
                        </div>

                    </div>

                 </div>



            </div>
        </div>
    )
}