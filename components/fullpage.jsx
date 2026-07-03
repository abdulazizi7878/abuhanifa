import Header from "@/components/header";
import Footer from "@/components/footer";
import Reviews from "@/components/reviews";

export default function FullPage(){
    return(
        <div className="w-full flex flex-col justify-center items-center">
            <Header />
            <section className="mt-30 w-20/20 flex justify-center items-center">
                 <Cont />
            </section>
            <Footer />
        </div>
    )
}




function Cont(){
    return(
        <div className="flex flex-col justify-center items-center">
            <section className="w-11/12 my-10 flex flex-wrap gap-y-20">

                <div className=" px-4 w-full sm:w-full md:w-1/2 lg:w-1/2 flex justify-center items-center">
                    {/* Changing font for the header text */}

                    <div className=" flex flex-col">
                        <div>
                            <h1 className="text-5xl my-2 font-[family-name:var(--secondary-font)] ">
                                Abu - Hanifa Installation 
                            </h1>
                            <hr  />
                            <h2 className="text-2xl mt-6 mb-2 font-[family-name:var(--primary-font)]">
                                General <span className="text-(--primary) font-bold">Electric</span>  and <span className="text-(--primary) font-bold">plumping work.</span>
                            </h2>        
                            <p className="font-stretch-150% font-[family-name:var(--primary-font)]">
                                We are a team of highly skilled and experienced electricians and plumpers, dedicated to providing top-notch electrical and plumbing services to our clients.
                            </p>
                            <p className="mt-4 font-stretch-150% font-[family-name:var(--primary-font)]">
                                Our team is committed to delivering high-quality workmanship, exceptional customer service, and innovative solutions to meet the unique needs of each project.
                            </p>
                                                        
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4">

                            <div className="w-fit px-6 py-2 bg-(--primary) rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                                <span className="text-white">
                                    Get In touch
                                </span>
                                <a href="/contact" className="absolute inset-0" ></a>
                            </div>

                            <div className="w-fit px-6 py-2 border border-(--primary) rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                                <span className="text-(--primary)">
                                    Learn More
                                </span>
                                <a href="#services" className="absolute inset-0" ></a>
                            </div>

                        </div>

                    </div>

                </div>


                <div className="hidden md:flex lg:flex px-4 w-full md:w-1/2 lg:w-1/2 flex-wrap-reverse justify-center items-center">
                    <img src="/images/logo.jpg" alt="ABU_HANIFA_INSTALLATION" className="w-11/15 max-w-1/2 rounded-full" />
                </div>
                
                
                
            </section>

            <hr className="my-26" />

            <section className="my-10 w-11/12  bg-gray-700 px-6 py-10 rounded-4xl " id="mission">
                <div className="w-full flex flex-col gap-6">
                    <p className="mx-auto text-background bg-(--primary) px-6 py-1 rounded-2xl font-bold">Our Mission</p>
                    <p className="mx-auto text-center max-w-120 text-white font-[family-name:var(--primary-font)]">
                        Our mission is to provide reliable and efficient electrical and plumbing services to our clients, while maintaining the highest standards of safety, quality, and professionalism.
                    </p>
                    <div className="w-fit mx-auto px-6 py-2 bg-(--primary) rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                        <span className="text-white">
                            Get In touch
                        </span>
                        <a href="/contact" className="absolute inset-0" ></a>
                    </div>
                </div>
            </section>

            <section id="services" className="w-11/12">
                <div className="w-full">
                    <p>OUR SERVICES</p>
                    <hr />
                </div>
                <div className="flex flex-wrap my-10 gap-x-16 gap-y-10  justify-center items-center">
                    <Service key={1} imgSource={"a.webp"} title={"Full Installations"} description={"Wiring for new builds, remodels, and system upgrades"} />  
                    <Service key={2} imgSource={"b.jpg"} title={"Circuit Breaker"} description={"Modernize your home with safe and up-to-date systems"} />  
                    <Service key={3} imgSource={"a.webp"} title={"Lighting Design"} description={"Custom indoor/outdoor lighting, energy-efficient upgrades"} />  
                </div>
                
            </section>

            <section className="my-20 flex flex-col gap-6">
                
                <div className="flex">
                    <h1 className="mx-auto text-center text-2xl font-extrabold">
                        Our Commitment to Excellence
                    </h1>
                </div>

                <div className="w-11/12 flex flex-wrap justify-center gap-y-8 mx-auto md:gap-x-10 lg:gap-x-10">
                    <p className="text-center sm:w-1/2 md:w-1/3 lg:1/3">
                        Dependable electrical solutions tailored to your property. 
                        Backed by the latest industry codes and safety standards, 
                        our skilled electricians guarantee a seamless experience from start to finish.
                    </p>
                    <p className="text-center sm:w-1/2 md:w-1/3 lg:1/3 font-[family-name:var(--third-font)]">
                        ለህንጻዎ ተስማሚ የሆኑ አስተማማኝ የኤሌክትሪክ መፍትሄዎች። አዳዲስ የአሰራር ደንቦችን (Codes) እና የደህንነት 
                        መስፈርቶችን መሰረት በማድረግ፣ የተካኑ የኤሌክትሪክ ባለሙያዎቻችን ስራውን ከመጀመሪያ እስከ መጨረሻ በስኬት ለማጠናቀቅ ዋስትና ይሰጣሉ።
                    </p>
                </div>
            </section>

            <section className="my-26 py-20 flex flex-col items-center bg-purple-950/60 w-screen">
                     <div>
                          <h1 className="text-4xl font-black text-white">Our works</h1>
                     </div>
                     <div className="flex gap-x-10 overflow-x-scroll px-10 py-20 w-screen">
                        <Img src={1} />
                        <Img src={2} />
                        <Img src={3} />
                        <Img src={4} />
                        <Img src={5} />
                        <Img src={6} />
                        <Img src={7} />
                        <Img src={8} />
                        <Img src={9} />
                        <Img src={10} />
                        <Img src={11} />
                        <Img src={12} />
                        <Img src={13} />
                        <Img src={14} />
                        <Img src={15} />
                     </div>
            </section>

            <section className="my-26" id="why">
                <div className="flex flex-col gap-y-10">

                    <div className="flex mx-auto w-max">
                        <h1 className="text-center font-bold text-xl">
                            Why Abu Hanifa Installation?  
                            <br />
                            አቡሐኒፋ ኢንስታሌሽንን መምረጥ ለምን አስፈለገ? 
                        </h1>
                    </div>

                    <div className="w-full  py-4 flex flex-col justify-center items-center gap-y-8">

                        <Why eng={"Our Professional and Certified"} amh={"ባለሙያዎቹ በዘርፉ የሰለጠኑ፣ ሰርተፍኬት ያላቸው እና ከፍተኛ ልምድ ያካበቱ ናቸው።"} dir={"_AX"} />
                        <Why eng={"Attention to Detail & High-Quality Work"} amh={"ለዝርዝር ነገሮች ትኩረት መስጠት እና ጥራቱን የጠበቀ ስራ "} dir={"_AXX"} />
                        <Why eng={"Transparent Pricing & No Hidden Fees"} amh={"ግልጽ የሆነ የዋጋ ተመን እና ምንም አይነት የተደበቀ ክፍያ የሌለበት"} dir={"_AX"} />
                        <Why eng={"Commitment to Safety and Industry Standards"} amh={"ለደህንነት እና ለኢንዱስትሪ መስፈርቶች (ስታንዳርዶች) ያለን ቁርጠኝነት"} dir={"_AXX"} />
                        <Why eng={"We take great pride in bringing all professinals feilds toghether under one roof"} amh={"ሁሉንም የሙያ ዘርፎች በአንድ ጣራ ስር ይዘን በመገኘታችን"} dir={"_AX"} />

                    </div>

                    <div className="flex flex-wrap  justify-around items-center gap-4">
                             
                        <div className="w-fit px-6 py-4 bg-(--primary) rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                            <span className="text-background">
                                Join our Telegram Channel
                            </span>
                            <a href="#services" className="absolute inset-0" ></a>
                        </div>

                        <div className="w-fit px-6 py-4 bg-(--primary) rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                            <span className="text-background">
                                Order Now 
                            </span>
                            <a href="/order" className="absolute inset-0" ></a>
                        </div>                    
                    </div>
                </div>
            </section>

            <section className="my-20">
                <div className="flex">
                    <h1 className="text-center mx-auto font-semibold text-xl">
                        Plumping and Sanitary Related Works
                    </h1>
                </div>

                <div className="mt-4 flex flex-wrap justify-center items-center">
                    <div className="">
                        <ul className="flex flex-wrap justify-center gap-8 mt-6">
                            <li className="_LI px-8 py-4 text-center w-full  sm:w-1/3 md:w-1/4 lg:w-1/5 border border-(--border)/65 rounded-4xl overflow-hidden relative">
                               <span className="font-extrabold">Full Installations</span> <br /> — Piping for new builds, remodels, and complete system upgrades.
                               <div>
                                <img src="/images/demo-1-a.webp" className="rounded-2xl absolute -z-10 -right-25 -top-30 " alt="DEMO_IMAGE" />
                                <div className="absolute inset-0 bg-background/80 -z-1"></div>
                               </div>
                            </li>
                            <li className="_LI px-8 py-4 text-center w-full  sm:w-1/3 md:w-1/4 lg:w-1/5 border border-(--border)/65 rounded-4xl overflow-hidden relative">
                                <span className="font-extrabold">Water Heaters & Pumps</span> <br /> — Modernize your home with efficient, safe, and up-to-date water systems.
                               <div>
                                 <img src="/images/demo-1-b.jpg" className="rounded-2xl absolute -z-10 -right-25 -top-30 " alt="DEMO_IMAGE" />
                                <div className="absolute inset-0 bg-background/80 -z-1"></div>
                               </div>
                            </li>
                            <li className="_LI px-8 py-4 text-center w-full  sm:w-1/3 md:w-1/4 lg:w-1/5 border border-(--border)/65 rounded-4xl overflow-hidden relative">
                                <span className="font-extrabold">Sanitary & Layout Design</span> <br /> — Custom indoor/outdoor fixtures, eco-friendly and water-saving upgrades.
                               <div>
                                 <img src="/images/demo-1-b.jpg" className="rounded-2xl absolute -z-10 -right-25 -top-30 " alt="DEMO_IMAGE" />
                                <div className="absolute inset-0 bg-background/80 -z-1"></div>
                               </div>
                            </li>
                            <li className="_LI px-8 py-4 text-center w-full  sm:w-1/3 md:w-1/4 lg:w-1/5 border border-(--border)/65 rounded-4xl overflow-hidden relative">
                                <span className="font-extrabold">Plumbing Services</span> <br /> — Piping, fixtures, drainage clearing, and routine safety inspections.
                               <div>
                                 <img src="/images/demo-1-b.jpg" className="rounded-2xl absolute -z-10 -right-25 -top-30 " alt="DEMO_IMAGE" />
                                <div className="absolute inset-0 bg-background/80 -z-1"></div>
                               </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="my-20 flex flex-col w-11/12">
                <div className="mx-auto w-100">
                    <h1 className="text-center font-bold text-2xl">
                        Reviews by our Satisfied Clients
                    </h1>
                </div>

                <div className="w-10/12 mx-auto px-4 py-10 flex flex-wrap justify-center items-center gap-10">
                    <Reviews />
                </div>
            </section>

            <section className="my-20 flex flex-col gap-10">
                <div>
                    <h1 className="font-black text-4xl text-center">
                        "Owner"
                    </h1>    
                </div> 

                <div className="mx-auto max-w-[95%] py-6 px-10 border border-(--border) rounded-2xl">
                    <div className="">
                        <img src="/images/profile-1.jpg" alt="OWNER'S IMAGE" className="size-35 rounded-full" />
                    </div>
                    <hr className="my-4"/>
                    <div>
                        <p className="my-2">
                            Hello, I'm Jemal, Owner of Abu - Hanifa Installation, <br /> I would like
                            to bring fast, high quality works for our clients.
                        </p>
                        <p className="font-black">
                            My professions:
                        </p>
                        <ul className="my-2">
                            <li className="_LI">Master of Science (M.Sc) in Project Management</li>
                            <li className="_LI">Bachelor of Science (B.Sc) in Chemistry</li>
                            <li className="_LI">Building Electrical Installation</li>
                            <li className="_LI">Sanitary and Plumbing Installation</li>
                            <li className="_LI">Computer Maintenance and Networking</li>
                            <li className="_LI">Mobile, Smart phone Hardware and Software Maintenances</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="flex flex-col justify-center items-center mt-20 bg-(--primary) h-screen w-full  relative">

                <div className="mx-auto  w-11/12">
                    <h1 className="text-white text-6xl _AY">
                        Let's work together
                    </h1>                    
                </div>

                <div className="mx-auto flex gap-6  w-11/12 my-10">
                    <div className="_AXX w-fit px-6 py-4 bg-white rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                        <span className="text-black">
                            Contact 
                        </span>
                        <a href="/contact" className="absolute inset-0" ></a>
                    </div>  
                    
                    <div className="_AX w-fit px-6 py-4 bg-white rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                        <span className="text-black">
                            Order
                        </span>
                        <a href="/order" className="absolute inset-0" ></a>
                    </div>  
                </div>

                <div className="absolute bottom-4">
                    <h1 className="font-black bg-background text-foreground py-2 px-6 rounded-full">&copy;Abu-Hanifa Installation</h1>
                </div>
            </section>
        </div>

    )
}


function Service({imgSource, title, description}){
    return(
        <div className="_AY border border-(--border) w-96 overflow-hidden rounded-4xl px-8 py-6 relative z-6 flex flex-col justify-center items-start hover:shadow-lg hover:shadow-black/10 ">
            <div className="mb-4 w-full">
                <img src={`/images/demo-1-${imgSource}`} alt="SERVICE_PHOTO" className="size-16 rounded-2xl" />

                <div className="absolute -top-4 right-[-15%] -z-1">
                    <img src={`/images/demo-1-${imgSource}`} className="w-60 h-30 z-2 rounded-4xl" />
                    <div className="bg-background/75 absolute inset-0 rounded-4xl"></div>
                </div>

                <hr  className="border-(--border) my-2" />
            </div>
            <div className="relative">
                <h2 className="font-bold mb-2">
                    {title}
                </h2>
                <p className="font-extralight">
                    {description}
                </p>
                <div className="absolute bottom-[-80px] left-[-15%] -z-1">
                    <img src={`/images/demo-1-${imgSource}`} className="w-60 h-30 z-2 rounded-4xl" />
                    <div className="bg-background/75 absolute inset-0 rounded-4xl"></div>
                </div>
            </div>
        </div>
    )
}


function Img({src}){
    return(
        <div className="relative min-w-90 h-max">
            <img src={`/images/w-${src}.jpg`} className="w-full h-full rounded-2xl" alt="" /> 
            <div className="absolute inset-0 bg-foreground/20  rounded-2xl"></div>                           
        </div>
    )
}
function Why({eng, amh, dir}){
    return(
        <div className={`${dir} max-w-[99%] flex flex-col gap-2  md:w-[90vw] lg:w-[70vw] border border-(--border) bg-purple-950/60 p-4 rounded-full duration-300 hover:shadow-2xl hover:shadow-foreground/50`}> 
            <p className="text-center text-white text-sm sm:text-md md:text-lg lg:text-lg ">{eng}.</p>
            <p className="text-center text-white text-[12px] sm:text-sm md:text-sm lg:text-sm font-[family-name:var(--third-font)]">{amh}</p>
        </div>
    )
}
