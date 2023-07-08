import { Container } from "react-bootstrap";
import shoaib from "../assets/team/mahmoudShoaib.jpeg";
import moIbrahim from "../assets/team/mohamedIbrahim.jpeg";
import moGad from "../assets/team/mohamedGad.jpeg";
import moTawfik from "../assets/team/mohamedTawfik.jpg";
import moHussein from "../assets/team/mohamedHussein.jpg";
import {
  EnvelopeFill,
  Facebook,
  Linkedin,
  Mailbox,
  Mailbox2,
  Twitter,
} from "react-bootstrap-icons";

function About() {
  const people = [
    {
      name: "Mahmoud Shoaib",
      role: "Front-end Developer - React",
      imageUrl: shoaib,
      linkedin: "https://www.linkedin.com/in/mahmoud-sabry-shoaib-779623192/",
      gmail: "miloshoaib@gmail.com",
    },
    {
      name: "Mohamed Ibrahim",
      role: "Machine Learning Engineer",
      imageUrl: moIbrahim,
      linkedin: "https://www.linkedin.com/in/mohammed-ibrahim-819468216/",
    },
    {
      name: "Mohamed Gad",
      role: "Machine Learning Engineer",
      imageUrl: moGad,
      linkedin: "https://www.linkedin.com/in/mohamed-gad-0808a41b3",
    },
    {
      name: "Mohamed Tawfik",
      role: "Back-end Developer - Node.js",
      imageUrl: moTawfik,
      linkedin: "https://www.linkedin.com/in/mohamed-twfik-bb6691216/",
      gmail: "mohamedtwfik910@gmail.com",
    },
    {
      name: "Mohamed Hussein",
      role: "Mobile Developer - Flutter",
      imageUrl: moHussein,
      linkedin: "https://www.linkedin.com/in/mohamed-hussien-9a491a21a",
      gmail: "mohamedhussien991999@gmail.com",
    },
  ];
  return (
    <div className="bg-white full-height mx-auto flex flex-col gap-x-8 gap-y-14 px-6 lg:px-8">
      <div className="p-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl border-b-2 border-emerald-500">
          Meet our Team
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          We’re a dynamic group of individuals who are passionate about what we
          do and dedicated to delivering the best results for our clients.
        </p>
      </div>
      <ul
        role="list"
        className="mx-auto mb-4 flex items-center justify-center gap-4 max-w-5xl flex-wrap"
      >
        {people.map((person) => (
          <li key={person.name} className="flex flex-col gap-6">
            <img
              className="w-72 rounded-3xl"
              src={person?.imageUrl}
              alt="person image"
            />
            <div>
              <h3 className="text-2xl font-semibold leading-7 tracking-tight text-gray-900">
                {person?.name}
              </h3>
              <p className="text-sm font-thin leading-6 text-emerald-600">
                {person?.role}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {person?.linkedin && (
                <a
                  href={person.linkedin}
                  target="_blank"
                  className="hover:text-blue-900"
                >
                  <Linkedin />
                </a>
              )}

              {person?.gmail && (
                <a
                  href={`mailto:${person?.gmail}`}
                  target="_blank"
                  className="hover:text-red-600"
                >
                  <EnvelopeFill />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default About;
