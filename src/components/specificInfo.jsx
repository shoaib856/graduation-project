import { Alert, Form, ListGroup } from "react-bootstrap";

const SpecificInfo = ({
  features,

  errors,
  touched,
  formikProps,
}) => {
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
      <Form.FloatingLabel className="mb-2">
        <Form.Control
          {...formikProps("workField")}
          id="workField"
          type="text"
          className=" form-field"
          placeholder="Work Field"
          autoComplete="nope"
          required
        />
        <Form.Label htmlFor="workField">Work Field</Form.Label>
        {errors.workField && touched.workField && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.workField}
          </Alert>
        )}
      </Form.FloatingLabel>
      <Form.FloatingLabel className="mb-2">
        <Form.Control
          {...formikProps("usageTarget")}
          id="usageTarget"
          type="text"
          className="form-field"
          placeholder="Usage Target"
          autoComplete="nope"
          required
        />
        <Form.Label htmlFor="usageTarget">Usage Target</Form.Label>
        {errors.usageTarget && touched.usageTarget && (
          <Alert
            variant="danger"
            className="mt-2 px-1 py-2 border-l-8 !text-sm"
          >
            {errors.usageTarget}
          </Alert>
        )}
      </Form.FloatingLabel>
      <fieldset className="border p-3 rounded">
        <legend>Features</legend>
        <ListGroup className="h-24 overflow-y-scroll">
          {features.length > 0 ? (
            features.map((feature) => {
              return (
                <ListGroup.Item key={feature}>
                  <Form.Check
                    className="flex gap-2"
                    type="checkbox"
                    id={feature}
                  >
                    <Form.Check.Input
                      className="cursor-pointer"
                      type="checkbox"
                      id={feature}
                      name="features"
                      {...formikProps("features")}
                    />
                    <Form.Check.Label className="grow cursor-pointer">
                      {feature}
                    </Form.Check.Label>
                  </Form.Check>
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
