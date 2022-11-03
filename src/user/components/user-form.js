import React from "react";
import validate from "./validators/user-validators";
import Button from "react-bootstrap/Button";

import * as API_USERS from "../api/user-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import { Col, Row } from "reactstrap";
import {
  FormGroup,
  Input,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.toggleForm = this.toggleForm.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reloadHandler = this.props.reloadHandler;

    this.state = {
      errorStatus: 0,
      error: null,
      admin: false,
      dropDownSelected: false,
      formIsValid: false,

      formControls: {
        name: {
          value: "",
          placeholder: "User name",
          valid: false,
          touched: false,
          validationRules: {
            minLength: 3,
            isRequired: true,
          },
        },
        password: {
          value: "",
          placeholder: "*******",
          valid: false,
          touched: false,
          validationRules: {
            minLength: 3,
            isRequired: true,
          },
        },
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleForm() {
    this.setState({ collapseForm: !this.state.collapseForm });
  }

  toggleDropdown() {
    this.setState({ dropDownSelected: !this.state.dropDownSelected });
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    const updatedControls = this.state.formControls;

    const updatedFormElement = updatedControls[name];

    updatedFormElement.value = value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = validate(
      value,
      updatedFormElement.validationRules
    );
    updatedControls[name] = updatedFormElement;

    let formIsValid = true;
    for (let updatedFormElementName in updatedControls) {
      formIsValid =
        updatedControls[updatedFormElementName].valid && formIsValid;
    }

    this.setState({
      formControls: updatedControls,
      formIsValid: formIsValid,
    });
  };

  registerUser(user) {
    return API_USERS.postUser(user, (result, status, error) => {
      if (result !== null && (status === 200 || status === 201)) {
        console.log("Successfully inserted user with id: " + result);
        this.reloadHandler();
      } else {
        this.setState({
          errorStatus: status,
          error: error,
        });
      }
    });
  }

  handleSubmit() {
    let user = {
      name: this.state.formControls.name.value,
      password: this.state.formControls.password.value,
      admin: this.state.admin,
    };

    console.log(user);
    this.registerUser(user);
  }

  changeValue(event) {
    if (event.currentTarget.textContent == "Admin") {
      this.setState({ admin: true });
    } else {
      this.setState({ admin: false });
    }
  }

  render() {
    return (
      <div>
        <FormGroup id="name">
          <Label for="nameField"> Name: </Label>
          <Input
            name="name"
            id="nameField"
            placeholder={this.state.formControls.name.placeholder}
            onChange={this.handleChange}
            defaultValue={this.state.formControls.name.value}
            touched={this.state.formControls.name.touched ? 1 : 0}
            valid={this.state.formControls.name.valid}
            required
          />
          {this.state.formControls.name.touched &&
            !this.state.formControls.name.valid && (
              <div className={"error-message row"}>
                {" "}
                * Name must have at least 3 characters{" "}
              </div>
            )}
        </FormGroup>

        <FormGroup id="password">
          <Label for="passwordField"> Password: </Label>
          <Input
            name="password"
            id="passwordField"
            placeholder={this.state.formControls.password.placeholder}
            onChange={this.handleChange}
            defaultValue={this.state.formControls.password.value}
            touched={this.state.formControls.password.touched ? 1 : 0}
            valid={this.state.formControls.password.valid}
            required
          />
        </FormGroup>

        <Label for="ownerField"> User Role: </Label>
        <Dropdown
          isOpen={this.state.dropDownSelected}
          toggle={this.toggleDropdown}
          on
        >
          <DropdownToggle caret>
            {this.state.admin == false ? "Client" : "Admin"}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.changeValue}>Admin</DropdownItem>
            <DropdownItem onClick={this.changeValue}>Client</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Row>
          <Col sm={{ size: "4", offset: 8 }}>
            <Button
              type={"submit"}
              disabled={!this.state.formIsValid}
              onClick={this.handleSubmit}
            >
              {" "}
              Submit{" "}
            </Button>
          </Col>
        </Row>

        {this.state.errorStatus > 0 && (
          <APIResponseErrorMessage
            errorStatus={this.state.errorStatus}
            error={this.state.error}
          />
        )}
      </div>
    );
  }
}

export default UserForm;
