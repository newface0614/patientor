import React from "react";
import { Field } from "formik";
import { Form } from "semantic-ui-react";

export type SelectedFieldOption = {
  value: string | number;
  label: string;
};

// <select> field props
type SelectedFieldProps = {
  name: string;
  label: string;
  options: SelectedFieldOption[];
};

export const SelectedField: React.FC<SelectedFieldProps> = ({
  name,
  label,
  options,
}: SelectedFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </Form.Field>
);