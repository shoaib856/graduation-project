import error404 from "../assets/images/404page.png";

const NotFound = () => {
  return (
    <div className="text-center">
      <img src={error404} alt="404" />
      <h2 className="text-6xl">Page Not Found</h2>
    </div>
  );
};

export default NotFound;
