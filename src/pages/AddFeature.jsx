import "animate.css";
import AddComponent from "../components/AddComponent";

const AddFeature = () => {
  document.title = "Dashboard | Add Feature";

  return (
    <AddComponent
      componentType={"feature"}
      initialValues={{
        feature: "",
        describtion: "",
        price: "",
      }}
    />
  );
};

export default AddFeature;
