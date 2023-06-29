import { Alert, Col, Form, Row } from "react-bootstrap";
import InputField from "./inputfield";

const GeneralInfo = ({ errors, touched, formikProps }) => {
  const fields = [
    {
      Label: "First Name",
      type: "text",
      placeholder: "",
      id: "firstName",
    },
    {
      Label: "Last Name",
      type: "text",
      placeholder: "",
      id: "lastName",
    },
    {
      Label: "User Name",
      type: "text",
      placeholder: "",
      id: "userName",
    },
    {
      Label: "Email",
      type: "email",
      placeholder: "example@email.com ",
      id: "email",
    },
    {
      Label: "Password",
      type: "password",
      placeholder: "",
      id: "password",
    },
    {
      Label: "Confirm Password",
      type: "password",
      placeholder: "",
      id: "confirmPassword",
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
export default GeneralInfo;
