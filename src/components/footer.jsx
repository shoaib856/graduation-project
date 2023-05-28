import { Facebook, Youtube, Linkedin, Twitter } from "react-bootstrap-icons";
import logo from "/logo.png";

const Footer = () => {
  return (
    <div className="bg-emerald-600 py-6 flex flex-col justify-center items-center">
      <div className="flex items-center mb-4">
        <img src={logo} alt="Logo" className="h-10 mr-2" />
        <span className="font-bold text-lg">
          <strong className="text-4xl text-white">Plant</strong>hie
        </span>
      </div>
      <div className="flex justify-center items-center mx-4">
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noreferrer"
          className="mx-4"
        >
          <Facebook
            className="text-white hover:!text-sky-600 hover:bg-white rounded-full"
            size={24}
          />
        </a>
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noreferrer"
          className="mx-4"
        >
          <Youtube className="text-white hover:!text-red-600" size={24} />
        </a>
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noreferrer"
          className="mx-4"
        >
          <Linkedin
            className="text-white hover:!text-sky-600 hover:bg-white"
            size={24}
          />
        </a>
        <a
          href="https://www.twitter.com/"
          target="_blank"
          rel="noreferrer"
          className="mx-4"
        >
          <Twitter className="text-white hover:!text-sky-600 " size={24} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
