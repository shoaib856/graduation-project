import { Badge, Container, Form } from "react-bootstrap";

const InputField = ({
  Label,
  type,
  placeholder,
  id,
  formikProps,
  errors,
  touched,
}) => {
  return (
    <Form.Group className="mb-2">
      <Container fluid className="flex justify-between items-center pb-1">
        <label htmlFor={id}>{Label}</label>
        {errors[id] && touched[id] ? (
          <Badge bg="danger">{errors[id]}</Badge>
        ) : null}
      </Container>
      <Form.Control
        id={id}
        {...formikProps(id)}
        type={type}
        placeholder={placeholder}
        autoComplete="nope"
        className="form-field"
      />
    </Form.Group>
  );
};

export default InputField;
