import { Alert, Badge, Col, Form, ListGroup, Row } from "react-bootstrap";
import InputField from "./inputfield";
import ShowOnHover from "./showOnHover";

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
        <ListGroup className="h-24 overflow-y-scroll">
          {features.length > 0 ? (
            features.map((feature) => {
              return (
                <ListGroup.Item key={feature.id}>
                  <ShowOnHover description={feature.describtion}>
                    <Form.Check
                      className="flex gap-2"
                      type="checkbox"
                      id={feature.feature}
                    >
                      <Form.Check.Input
                        className="cursor-pointer w-5 h-5 my-auto checked:bg-emerald-600 checked:border-emerald-300 shadow-none border-gray-300 focus:border-emerald-300"
                        type="checkbox"
                        id={feature.feature}
                        name="features"
                        {...formikProps("features")}
                      />
                      <Form.Check.Label className="grow cursor-pointer">
                        {feature.feature}
                      </Form.Check.Label>

                      <Badge bg="secondary" className="p-1">
                        {feature.price}$
                      </Badge>
                    </Form.Check>
                  </ShowOnHover>
                </ListGroup.Item>
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
