import React, { useEffect } from "react";
import { Form } from "react-bootstrap";

const EditableField = ({ as, id, label, formik, beforeEditData }) => {
  const [disabled, setDisabled] = React.useState(true);
  const fieldRef = React.useRef(null);
  useEffect(() => {
    if (disabled) {
      formik.setFieldValue(id, beforeEditData);
    }
  }, [disabled]);
  useEffect(() => {
    if (!disabled) {
      fieldRef.current.focus();
    }
  }, [disabled]);

  return (
    <Form.Group className="flex flex-col flex-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="font-thin" htmlFor={id}>
            {label}
          </label>
          {formik.touched[id] && formik.errors[id] ? (
            <div className="text-red-500 text-sm">{formik.errors[id]}</div>
          ) : null}
        </div>
        <Form.Check
          type="switch"
          id={`custom-switch-${id}`}
          className="shadowless-switch flex items-center gap-1 text-amber-300"
          label="edit"
          onChange={() => setDisabled(!disabled)}
        />
      </div>
      <Form.Control
        as={as ? as : "input"}
        type="text"
        className="form-field"
        ref={fieldRef}
        id={id}
        name={id}
        placeholder={label}
        disabled={disabled}
        {...formik.getFieldProps(id)}
      />
    </Form.Group>
  );
};

export default EditableField;
