import React from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";

const SelectBox = ({ formik, options, id, label }) => {
  const [disabled, setDisabled] = useState(true);
  return (
    <Form.Group className="flex flex-col gap-1">
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
      <Form.Select
        disabled={disabled}
        className="form-field"
        id={id}
        {...formik.getFieldProps(id)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default SelectBox;
