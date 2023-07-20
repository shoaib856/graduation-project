import {Badge, Form} from "react-bootstrap";

const InputField = ({
                        as,
                        Label,
                        type,
                        placeholder,
                        id,
                        formikProps,
                        errors,
                        touched,
                        disabled = false
                    }) => {
    return (
        <Form.Group className="mb-2">
            {Label && (
                <div className="flex justify-between items-center pb-1">
                    <label htmlFor={id}>{Label}</label>
                    {errors[id] && touched[id] ? (
                        <Badge bg="danger">{errors[id]}</Badge>
                    ) : null}
                </div>
            )}
            <Form.Control
                id={id}
                as={as ? as : "input"}
                {...formikProps(id)}
                type={type}
                placeholder={placeholder}
                autoComplete="nope"
                className="form-field"
                disabled={disabled}
            />
        </Form.Group>
    );
};

export default InputField;
