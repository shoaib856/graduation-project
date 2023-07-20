import HeroSection from "../assets/images/HeroSection.png";
import background from "../assets/images/vibrant-green-plants.jpg";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useEffect} from "react";
import useAuthValue from "../hooks/useAuthValue";
import {
    Bag,
    Building,
    Camera2,
    Cash,
    CashStack,
    Clock,
    Flag,
    Flower2,
    GraphUpArrow,
    ListCheck,
    People,
    PersonFillAdd,
    PersonFillCheck,
    SignpostSplit,
    Upload
} from "react-bootstrap-icons";

function Home() {
    document.title = "FarmVision | Home";
    const auth = useAuthValue();
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.isIntersecting
                    ? entry.target.classList.add("show-animation")
                    : entry.target.classList.remove("show-animation");
            });
        }, []);

        const hiddenElements = document.querySelectorAll(".hidden-animation");
        const hiddenElementsLift = document.querySelectorAll(
            ".hidden-animation-left"
        );
        const hiddenElementsRight = document.querySelectorAll(
            ".hidden-animation-right"
        );
        hiddenElements.forEach((ele) => observer.observe(ele));
        hiddenElementsLift.forEach((ele) => observer.observe(ele));
        hiddenElementsRight.forEach((ele) => observer.observe(ele));
    });
    const steps = [
        {
            title: "step 1",
            description: "Choose the desired feature that you wish to utilize."
        },
        {
            title: "step 2",
            description: "Use your camera or gallery to provide a picture of the plant."
        },
        {
            title: "step 3",
            description: "Upload the selected image to the platform."
        },
        {
            title: "step 4",
            description: "Wait for processing to finish and get the results."
        }
    ]
    const benefits = [
        {
            title: "Increased crop yields",
            description: "Our platform prevents crop losses and increases yields by providing farmers with early and accurate detection and treatment of plant diseases."
        },
        {
            title: "Reduced costs",
            description: "Our platform saves farmers money by preventing disease spread and minimizing crop losses with tailored treatment recommendations that are cost-effective and efficient."
        }, {
            title: "Improved sustainability",
            description: "Our platform promotes sustainable agriculture by reducing pesticide use, promoting biodiversity, and ensuring long-term viability while protecting the environment."
        }, {
            title: "Informed decision-making",
            description: "Our platform offers detailed reports on plant diseases, helping farmers and researchers make informed decisions to manage crops and prevent disease spread."
        },
        {
            title: "Time-saving",
            description: "Our platform saves farmers and researchers time and effort with quick and accurate crop image analysis, freeing up time for other important tasks."
        },
        {
            title: "User-friendly",
            description: "Our user-friendly platform is accessible to a wide range of users, from small-scale farmers to large agricultural organizations, regardless of technical expertise."
        },
    ]
    const whoWeServe = [
        {
            title: "Farmers",
            description: "Find customized treatment recommendations and protect your crops from disease spread."
        },
        {
            title: "Agronomists",
            description: "Access detailed reports on plant diseases and improve crop management."
        },
        {
            title: "Agricultural Extension Workers",
            description: "Get accurate information on disease type and severity to help farmers in your community."
        },
        {
            title: "Food Companies",
            description: "Ensure the quality of your supply chain with reliable crop disease detection."
        },
        {
            title: "Agricultural Investment Companies",
            description: "Invest with confidence with accurate data on crop health and disease management."
        },
        {
            title: "Governments",
            description: "Protect your country's food security with reliable crop disease detection and management."
        }
    ]
    return (
        <Container className="overflow-hidden py-10 flex flex-col">
            <section className="flex items-center mb-28 md-lg:flex-col mx-auto">
                <div className="desc max-w-xl w-full md:text-center">
                    <div className={"hidden-animation"}>
                        <h1 className="text-slate-800 text-5xl md:text-4xl font-bold">
                            Revolutionizing Plant Disease Detection
                        </h1>
                        <p className={"text-lg text-gray-400"}>
                            How Our Platform Helps Farmers Protect Their Crops
                        </p>
                    </div>
                    <p className="text-slate-500 text-lg my-14 hidden-animation-left delay-100">
                        Our platform uses object detection and advanced algorithms to identify plant diseases
                        accurately, providing treatment recommendations and detailed reports on disease type and
                        severity. It helps farmers, researchers, and others interested in the environment make informed
                        decisions about protecting crops and preventing disease spread.
                    </p>
                    <div className="flex justify-between items-center pt-4 hidden-animation">
                        {auth ? (
                            <p className="btn btn-info text-white disabled">Logged in</p>
                        ) : (
                            <Link
                                to={"./register"}
                                className="text-white bg-emerald-400 hover:bg-emerald-600 active:bg-emerald-600 font-bold !border-none flex items-center gap-2 py-2 px-4 rounded"
                            >
                                <PersonFillAdd/>
                                Join Now
                            </Link>
                        )}
                        <a
                            href={"#how-it-works"}
                            className="text-slate-600 text-lg hover:text-slate-400 md-lg:text-sm"
                        >
                            See how it works{"-->"}
                        </a>
                    </div>
                </div>
                <div className="shadow-xl !max-w-2xl !w-full ml-12 md-lg:hidden hidden-animation-right">
                    <img
                        src={HeroSection}
                        alt="hero section"
                        className={"rounded"}
                    />
                </div>
            </section>
            <section id={"how-it-works"} className={"pt-28 mb-28"}>
                <div className="desc text-center mx-auto ">
                    <h2 className="text-5xl md:text-3xl font-medium text-slate-900">
                        Steps to Start Your Plants Off Right
                    </h2>
                    <p className="text-slate-400 text-2xl">Follow instruction for more</p>
                </div>
                <div className="flex pt-12 justify-center flex-wrap gap-4  mx-auto text-white text-center ">
                    {
                        steps.map((step, i) => (
                            <div key={i}
                                 className="py-4 bg-white/50 shadow-xl rounded-lg max-w-[250px] hidden-animation-left">
                                <div className="text-8xl text-black flex justify-center mb-4">
                                    {i === 0 ? <ListCheck/> :
                                        i === 1 ? <Camera2/> :
                                            i === 2 ? <Upload/> : <Clock/>}
                                </div>
                                <h3 className="text-slate-900 text-2xl mb-3 font-bold uppercase">
                                    {step.title}
                                </h3>
                                <p className="px-4 text-lg text-slate-400">
                                    {step.description}
                                </p>
                            </div>
                        ))
                    }
                </div>
            </section>
            <section className="flex flex-col items-center pt-28 mb-28">
                <div className="desc text-center mx-auto">
                    <h2 className="text-5xl md:text-3xl font-medium text-slate-900 uppercase">
                        Benefits for Using our project
                    </h2>
                </div>
                <div className="flex pt-12 justify-center flex-wrap gap-4  mx-auto text-white text-center ">
                    {
                        benefits.map((benefit, i) => (
                            <div key={i} className="py-4 bg-white/50 shadow-xl rounded-lg max-w-xs hidden-animation">
                                <div className="text-8xl text-black flex justify-center mb-4">
                                    {i === 0 ? <GraphUpArrow/> :
                                        i === 1 ? <CashStack/> :
                                            i === 2 ? <GraphUpArrow/> :
                                                i === 3 ? <SignpostSplit/> :
                                                    i === 4 ? <Clock/> : <PersonFillCheck/>}
                                </div>
                                <h3 className="text-slate-900 text-2xl mb-3 font-bold uppercase">
                                    {benefit.title}
                                </h3>
                                <p className="px-4 text-lg text-slate-400">
                                    {benefit.description}
                                </p>
                            </div>
                        ))
                    }
                </div>

            </section>
            <section
                className="mx-auto p-10 md:p-5 mb-28 bg-cover bg-center bg-no-repeat rounded-lg shadow-xl after:bg-white/50 after:backdrop-blur-sm after:absolute after:inset-0 after:rounded-lg relative z-10 after:-z-10"
                style={{background: "url(" + background + ")", backgroundSize: "cover"}}
            >
                <div className="desc text-center mx-auto">
                    <h2 className="text-5xl md:text-3xl font-medium text-slate-900">
                        Revolutionizing Agriculture
                    </h2>
                    <p className="text-emerald-600 text-2xl md:text-lg">
                        Tackling Plant Diseases and Boosting Crop Yields
                    </p>
                </div>
                <div>
                    <p className={"text-2xl md:text-lg text-slate-800 mt-4 text-center"}>
                        The agricultural industry faces challenges from plant diseases that can result in significant
                        crop losses and food insecurity. Traditional methods of disease detection are prone to errors
                        and time-consuming. Our solution offers a remedy to these challenges.
                    </p>
                </div>
            </section>

            <section className="flex items-center flex-col mx-auto">
                <div className="desc text-center mx-auto">
                    <h2 className="text-5xl md:text-3xl font-medium text-slate-900 uppercase">
                        Who we serve
                    </h2>
                </div>
                <div className="flex pt-12 justify-center flex-wrap gap-4 text-white text-center ">
                    {
                        whoWeServe.map((customer, i) => (
                            <div key={i} className="py-4 bg-white/50 shadow-xl rounded-lg max-w-xs hidden-animation">
                                <div className="text-7xl text-black flex justify-center mb-4">
                                    {i === 0 ? <People/> :
                                        i === 1 ? <Flower2/> :
                                            i === 2 ? <Building/> :
                                                i === 3 ? <Bag/> :
                                                    i === 4 ? <Cash/> : <Flag/>}
                                </div>
                                <h3 className="px-1 text-slate-900 text-2xl mb-3 font-bold uppercase">
                                    {customer.title}
                                </h3>
                                <p className="px-4 text-lg text-slate-400">
                                    {customer.description}
                                </p>
                            </div>
                        ))
                    }
                </div>

            </section>
        </Container>
    );
}

export default Home;
