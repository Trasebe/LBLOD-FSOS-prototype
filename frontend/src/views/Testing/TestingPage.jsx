import React, { Component } from "react";
import { notification } from "antd";

import ChainService from "../../Services/ChainService";

class TestingPage extends Component {
  constructor(props) {
    super(props);

    this.chainService = new ChainService();

    this.state = {
      type: { publish: false, sign: false },
      person: { random: false, one: false, two: false, three: false },
      version: { one: false, two: false, three: false },
      id: { random: false, own: false, value: "" }
    };
  }

  openNotification = (title, message) => {
    const args = {
      message: title,
      description: message,
      duration: 5
    };
    notification.open(args);
  };

  handleTypeChange = index => {
    const { type } = this.state;
    if (index === 0) {
      type.publish = !type.publish;
      type.sign = false;
    } else {
      type.sign = !type.sign;
      type.publish = false;
    }
    this.setState({ type });
  };

  handlePersonChange = index => {
    const { person } = this.state;
    if (index === -1) {
      person.random = !person.random;
      person.one = false;
      person.two = false;
      person.three = false;
    } else if (index === 0) {
      person.one = !person.one;
      person.random = false;
      person.two = false;
      person.three = false;
    } else if (index === 1) {
      person.two = !person.two;
      person.random = false;
      person.one = false;
      person.three = false;
    } else if (index === 2) {
      person.three = !person.three;
      person.random = false;
      person.one = false;
      person.two = false;
    }
    this.setState({ person });
  };

  handleVersionChange = index => {
    const { version } = this.state;
    if (index === 0) {
      version.one = !version.one;
      version.two = false;
      version.three = false;
    } else if (index === 1) {
      version.two = !version.two;
      version.one = false;
      version.three = false;
    } else if (index === 2) {
      version.three = !version.three;
      version.one = false;
      version.two = false;
    }
    this.setState({ version });
  };

  handleIDChange = index => {
    const { id } = this.state;
    if (index === 0) {
      id.random = !id.random;
      id.own = false;
    } else {
      id.own = !id.own;
      id.random = false;
    }
    this.setState({ id });
  };

  handleValueChanges = event => {
    const { id } = this.state;
    id.value = event.target.value;
    this.setState({ id });
  };

  reset = () => {
    const { type, person, version, id } = this.state;
    type.publish = false;
    type.sign = false;
    person.random = false;
    person.one = false;
    person.two = false;
    person.three = false;
    version.one = false;
    version.two = false;
    version.three = false;
    id.random = false;
    id.own = false;
    id.value = "";
    this.setState({ type });
  };

  /* eslint-disable no-nested-ternary */

  create = () => {
    const { type, person, version, id } = this.state;
    if (type.publish || type.sign) {
      if (person.random || person.one || person.two || person.three) {
        if (version.one || version.two || version.three) {
          if (id.random || (id.own && id.value !== "")) {
            this.chainService.createResource(
              id.random ? null : id.value,
              type.publish ? "publish" : "sign",
              person.random ? null : person.one ? 0 : person.two ? 1 : 2,
              version.one ? 1 : version.two ? 2 : 3
            );
          }
        }
      }
    }
  };

  render() {
    const { type, person, version, id } = this.state;
    return (
      <div>
        <div>
          <h2 style={{ marginBottom: 20 }}>Testing page</h2>
          <form>
            <label htmlFor="id">
              Publishing:
              <input
                style={{ marginLeft: 10 }}
                name="isGoing"
                type="checkbox"
                checked={type.publish}
                onChange={() => this.handleTypeChange(0)}
              />
            </label>
            <label style={{ marginLeft: 20 }} htmlFor="id">
              Signing:
              <input
                style={{ marginLeft: 10 }}
                name="isGoing"
                type="checkbox"
                checked={type.sign}
                onChange={() => this.handleTypeChange(1)}
              />
            </label>
            <br />
            <div style={{ marginTop: 20 }}>
              <label htmlFor="id">
                Random person:
                <input
                  style={{ marginLeft: 10 }}
                  name="isGoing"
                  type="checkbox"
                  checked={person.random}
                  onChange={() => this.handlePersonChange(-1)}
                />
              </label>
              <label style={{ marginLeft: 20 }} htmlFor="id">
                Person 1:
                <input
                  style={{ marginLeft: 10 }}
                  name="isGoing"
                  type="checkbox"
                  checked={person.one}
                  onChange={() => this.handlePersonChange(0)}
                />
              </label>
              <label style={{ marginLeft: 20 }} htmlFor="id">
                Person 2:
                <input
                  style={{ marginLeft: 10 }}
                  name="isGoing"
                  type="checkbox"
                  checked={person.two}
                  onChange={() => this.handlePersonChange(1)}
                />
              </label>
              <label style={{ marginLeft: 20 }} htmlFor="id">
                Person 3:
                <input
                  style={{ marginLeft: 10 }}
                  name="isGoing"
                  type="checkbox"
                  checked={person.three}
                  onChange={() => this.handlePersonChange(2)}
                />
              </label>
            </div>
            <div style={{ marginTop: 20 }}>
              <label htmlFor="id">
                Version 1:
                <input
                  style={{ marginLeft: 10 }}
                  name="isGoing"
                  type="checkbox"
                  checked={version.one}
                  onChange={() => this.handleVersionChange(0)}
                />
              </label>
              <label style={{ marginLeft: 20 }} htmlFor="id">
                Version 2:
                <input
                  style={{ marginLeft: 10 }}
                  name="isGoing"
                  type="checkbox"
                  checked={version.two}
                  onChange={() => this.handleVersionChange(1)}
                />
              </label>
              <label style={{ marginLeft: 20 }} htmlFor="id">
                Version 3:
                <input
                  style={{ marginLeft: 10 }}
                  name="isGoing"
                  type="checkbox"
                  checked={version.three}
                  onChange={() => this.handleVersionChange(2)}
                />
              </label>
            </div>
            <div style={{ marginTop: 20 }}>
              <label htmlFor="id">
                Random new Blockchain ID:
                <input
                  style={{ marginLeft: 10 }}
                  name="isGoing"
                  type="checkbox"
                  checked={id.random}
                  onChange={() => this.handleIDChange(0)}
                />
              </label>
              <label style={{ marginLeft: 20 }} htmlFor="id">
                Choose own ID:
                <input
                  style={{ marginLeft: 10 }}
                  name="isGoing"
                  type="checkbox"
                  checked={id.own}
                  onChange={() => this.handleIDChange(1)}
                />
                <input
                  style={{ marginLeft: 10 }}
                  name="isGoing"
                  type="input"
                  value={id.value}
                  onChange={event => this.handleValueChanges(event)}
                />
              </label>
            </div>
          </form>
          <div style={{ marginTop: 30 }}>
            <button
              style={{ marginRight: 10 }}
              type="button"
              onClick={this.reset}
            >
              Reset
            </button>
            <button type="button" onClick={this.create}>
              Create resource
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default TestingPage;
