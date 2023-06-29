import { Alert, Badge, Form, ListGroup } from "react-bootstrap";
import InputField from "./inputField";
import ShowOnHover from "./showOnHover";
import MarkMultiItems from "./MarkMultiItems";

const SpecificInfo = ({ features, errors, touched, formikProps }) => {
  const fields = [
    {
      Label: "Work Field",
      type: "text",
      placeholder: "",
      id: "workField",
    },

    {
      Label: "Usage Target",
      type: "text",
      placeholder: "",
      id: "usageTarget",
    },
  ];
  return (
    <>
      <Form.FloatingLabel className="mb-2" label={"Role"}>
        <Form.Select
          className="form-field cursor-pointer"
          onChange={formikProps("role").handleChange}
          id="role"
        >
          <option value="farmer">Farmer</option>
          <option value="engineer">Engineer</option>
        </Form.Select>
      </Form.FloatingLabel>
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
      <fieldset className="border p-3 rounded">
        <legend>Features</legend>
        <ListGroup className="h-32 overflow-y-scroll">
          {features.length > 0 ? (
            features.map((feature) => {
              return (
                <MarkMultiItems
                  key={feature.id}
                  formikProps={formikProps.getFieldProps}
                  itemDescription={feature.describtion}
                  itemName={feature.feature}
                  itemType={"features"}
                  itemPrice={feature.price}
                />
              );
            })
          ) : (
            <Alert variant="warning" className="border-l-8 border-l-orange-500">
              No Features Till Now!
            </Alert>
          )}
        </ListGroup>
      </fieldset>
    </>
  );
};
export default SpecificInfo;
