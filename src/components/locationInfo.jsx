import InputField from "./inputField";

const LocationInfo = ({ errors, touched, formikProps }) => {
  const fields = [
    {
      Label: "Phone Number",
      type: "text",
      placeholder: "",
      id: "phoneNumber",
    },
    {
      Label: "Country Location",
      type: "text",
      placeholder: "",
      id: "country",
    },
    {
      Label: "State Location",
      type: "text",
      placeholder: "",
      id: "state",
    },
    {
      Label: "City Location",
      type: "text",
      placeholder: "",
      id: "city",
    },
    {
      Label: "Street Name",
      type: "text",
      placeholder: "",
      id: "streetName",
    },

    {
      Label: "Post Code",
      type: "text",
      placeholder: "",
      id: "postCode",
    },
  ];
  return (
    <>
      {fields.map((field, index) => (
        <InputField
          key={index}
          Label={field.Label}
          type={field.type}
          placeholder={field.placeholder}
          id={field.id}
          formikProps={formikProps}
          errors={errors}
          touched={touched}
        />
      ))}
    </>
  );
};
export default LocationInfo;
