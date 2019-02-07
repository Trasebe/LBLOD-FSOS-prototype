import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Form, Icon, Input, Select } from "antd";

import "./MyForm.css";

const FormItem = Form.Item; // eslint-disable-line
const Option = Select.Option; // eslint-disable-line

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class MyForm extends Component {
  componentDidMount() {
    const {
      onRef,
      formFields,
      form: { validateFields, setFieldsValue }
    } = this.props;

    if (onRef) {
      onRef(this);
    }

    // To disabled submit button at the beginning.
    validateFields();

    formFields.map(field => {
      // eslint-disable
      setFieldsValue({
        [field.label]: field.value
      });
    });
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(undefined);
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    const {
      handleSubmit,
      form: { validateFields }
    } = this.props;

    validateFields((err, values) => {
      if (!err) {
        handleSubmit(values);
      }
    });
  };

  method(value) {
    const {
      form: { setFieldsValue }
    } = this.props;

    setFieldsValue({
      agentschap: value
    });
  }

  render() {
    // const formItemLayout = {
    //   labelCol: { span: 6 },
    //   wrapperCol: { span: 14 },
    // };

    const {
      form: {
        getFieldDecorator,
        getFieldsError,
        getFieldError,
        isFieldTouched
      },
      formFields,
      dropdown,
      btnText
    } = this.props;

    // Only show error after a field is touched.
    const valueError = isFieldTouched("value") && getFieldError("value");

    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        {Object.values(formFields).map((field, index) => (
          <FormItem
            style={{ width: "60%", marginBottom: "7px" }}
            label={field.label}
            validateStatus={valueError ? "error" : ""}
            help={valueError || ""}
            key={`${index}-form`}
          >
            {getFieldDecorator(field.label, {
              rules: [
                { required: field.required, message: "Please input a value!" }
              ]
            })(
              <Input
                disabled={field.disabled}
                prefix={
                  <Icon type="edit" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder={field.value}
              />
            )}
          </FormItem>
        ))}

        {dropdown && (
          <FormItem label="Select" hasFeedback>
            {getFieldDecorator("select", {
              rules: [{ required: true, message: "Selecteer een attribuut" }]
            })(
              <Select
                placeholder="Selecteer een attribuut"
                initialValue={dropdown[0]}
              >
                {dropdown.map((val, index) => (
                  <Select.Option key={`${index}-${val}`} value={val}>
                    {val}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            {btnText}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

MyForm.propTypes = {
  form: PropTypes.object.isRequired,
  formFields: PropTypes.array.isRequired,
  btnText: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onRef: PropTypes.func,
  dropdown: PropTypes.array
};

MyForm.defaultProps = {
  onRef: undefined,
  dropdown: undefined
};

export default Form.create()(MyForm);
