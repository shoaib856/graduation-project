import cactusAndButterfly from "../assets/images/cactus&butterfly.png";
import greenLeafedPlantAndBird from "../assets/images/green-leafed-plant&bird.png";
import shutterStock from "../assets/images/shutterstock.png";
import americanBeech from "../assets/images/American_Beech.png";

import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import useAuthValue from "../hooks/useAuthValue";
import { PersonFillAdd } from "react-bootstrap-icons";

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
  return (
    <Container className="overflow-hidden py-10 flex flex-col gap-32">
      <section className="flex items-center gap-24 md-lg:flex-col mx-auto">
        <div className="desc max-w-xl w-full text-right md-lg:text-center">
          <h1 className="text-slate-800 text-7xl md-lg:text-5xl font-bold hidden-animation">
            We love helping you to safe the earth ☘️
          </h1>
          <p className="text-slate-400 text-2xl md-lg:text-lg my-14 hidden-animation-left delay-100">
            We help realize your dreams in making a garden, let's start with
            small things that can change the world, so you can enjoy the fresh
            air forever
          </p>
          <div className="flex justify-between items-center pt-4 hidden-animation">
            {auth ? (
              <p className="btn btn-info text-white disabled">Logged in</p>
            ) : (
              <Link
                to={"./register"}
                className="text-white bg-emerald-400 hover:bg-emerald-600 active:bg-emerald-600 font-bold !border-none flex items-center gap-2 py-2 px-4 rounded"
              >
                <PersonFillAdd />
                Join Now
              </Link>
            )}
            <a
              href="/"
              className="text-slate-600 text-lg hover:text-slate-400 md-lg:text-sm"
            >
              See how it works{"-->"}
            </a>
          </div>
        </div>
        <div className="md-lg:hidden hidden-animation-right">
          <img
            src={cactusAndButterfly}
            alt="cactus"
            className="max-w-2xl w-full"
          />
        </div>
      </section>
      <section>
        <div className="desc text-center mx-auto ">
          <h1 className="text-5xl text-slate-900">
            Steps to Start Your Plants Off Right
          </h1>
          <p className="text-slate-400 text-2xl">Follow instruction for more</p>
        </div>
        <div className="flex pt-12 justify-center flex-wrap gap-4  mx-auto text-white text-center ">
          <div className="py-4 bg-white/50 shadow-xl rounded-lg max-w-[300px] hidden-animation-left">
            <div className="custom-bg-img br-1">🌿</div>
            <h3 className="text-slate-900 text-2xl mb-3 font-bold">
              Inoculate
            </h3>
            <p className="px-4 text-xl text-slate-400">
              Coating the seed with bacteria that allow it to "fix" nitrogen
              soil.
            </p>
          </div>
          <div className="py-4 bg-white/40 shadow-xl rounded-lg max-w-[300px] hidden-animation-left">
            <div className="custom-bg-img br-2">🌱</div>
            <h3 className="text-slate-900 text-2xl mb-3 font-bold">
              Sow the seeds
            </h3>
            <p className="px-4 text-xl text-slate-400">
              The quantities of our additions are not an exact science.
            </p>
          </div>
          <div className="py-4 bg-white/40 shadow-xl rounded-lg max-w-[300px] hidden-animation-left">
            <div className="custom-bg-img br-3">🪴</div>
            <h3 className="text-slate-900 text-2xl mb-3 font-bold">
              Punt the Pots
            </h3>
            <p className="px-4 text-xl text-slate-400">
              We own two of these blockers, one with a seed pin that makes
            </p>
          </div>
        </div>
      </section>
      <section className="flex items-center gap-24 md-lg:flex-col mx-auto">
        <div className="flex-shrink-1 hidden-animation-left">
          <img
            src={greenLeafedPlantAndBird}
            alt="greenLeafedPlant"
            className="max-w-2xl w-full"
          />
        </div>
        <div className="desc max-w-lg px-10 md-lg:px-0 md-lg:text-center">
          <h1 className="font-extrabold text-slate-900 mb-10 text-5xl md-lg:text-4xl hidden-animation">
            Make your garden good nutrition
          </h1>
          <ul
            className="flex flex-col gap-4 text-slate-400 pl-3 text-2xl md-lg:text-xl"
            style={{ listStyleType: "square" }}
          >
            <li className="hidden-animation-right delay-100">
              Fleshy and moist, mineral-rich banana skins easily diffuse potent
              nutrients
            </li>
            <li className="hidden-animation-right delay-150">
              Eggshells are chock full of nitrogen, calcium, and phosphoric acid
            </li>
            <li className="hidden-animation-right delay-200">
              Wood ashes are typically used to raise soil pH and can either be
              scattered or composted.
            </li>
          </ul>
        </div>
      </section>
      <section className="flex items-center gap-24 md-lg:flex-col mx-auto">
        <div className="desc max-w-lg px-10 md-lg:px-0 text-right md-lg:text-center ">
          <h1 className="font-extrabold text-slate-900 mb-10 text-5xl md-lg:text-4xl hidden-animation">
            Come with us grow up your plant
          </h1>
          <p className="text-slate-400 text-2xl md-lg:text-xl hidden-animation-left delay-100">
            Caring for plants can be very rewarding, even if they include ferns
            and don't produce fragrant flowers. This wikiHow teaches you many
            tips on how to grow healthy plants.
          </p>
          <a
            href="/"
            className="block mt-36 text-2xl text-slate-600 hover:text-slate-400"
          >
            See how it works {" -->"}
          </a>
        </div>
        <div className="flex-shrink-1">
          <img
            src={shutterStock}
            alt="shutterStock"
            className="max-w-2xl w-full hidden-animation-right"
          />
          <p className="text-slate-600 text-4xl font-bold">---smoothly</p>
          <span className="text-slate-400 text-2xl">
            Smoothly and healthy plant for you and all people
          </span>
        </div>
      </section>
      <section className="flex items-center gap-24 md-lg:flex-col mx-auto">
        <div className="flex-shrink-1">
          <img
            src={americanBeech}
            alt="americanBeech"
            className="max-w-2xl w-full hidden-animation-left"
          />
          <p className="text-slate-600 text-4xl font-bold">---draken</p>
          <span className="text-slate-400 text-2xl ">
            Draken is not just a black, but green to
          </span>
        </div>
        <div className="desc max-w-lg px-10 md-lg:px-0 md-lg:text-center ">
          <h1 className="font-extrabold text-slate-900 mb-10 text-5xl md-lg:text-4xl hidden-animation">
            See video for more information
          </h1>
          <p className="text-slate-400 text-2xl md-lg:text-xl hidden-animation-right delay-100">
            You can be entertained by seeing amazing videos of how plants grow
            and pick up a few insights that will help you be more successful
            with your indoor garden.
          </p>
          <button className="text-lg font-bold mt-32 md-lg:mt-16 px-10 py-2 !rounded-full text-emerald-400 border-4 border-emerald-400 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white ">
            Watch Now
          </button>
        </div>
      </section>
    </Container>
  );
}

export default Home;
