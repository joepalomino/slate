/** @jsx jsx */

import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Wrapper } from "./Wrapper";
import { jsx } from "@emotion/core";
import { FaCircle, FaTimes } from "react-icons/fa";

const slateColors = ["#F8B195", "#C06C84", "#355C7D"];

function NewSlate(props) {
  const handleChange = e => {
    props.onSlateInputChange(e.target.value, e.target.name);
  };

  return (
    <div>
      <form onSubmit={e => e.preventDefault()}>
        <div>
          <label for="slateName" css={{
            display: 'none'
          }}>
            
            name:
            </label>
            <input
              id="slateName"
              type="text"
              name="slateName"
              value={props.slateName}
              onChange={handleChange}
              css={{
                outline: 'none',
                border: 'none',
                backgroundColor: '#FAFAFB',
                borderRadius: 8,
                padding: '.3rem',
                width: '100%'
              }}
              placeholder='slate name'
            />
            {props.showError && <div>Enter Slate Name</div>}
          
        </div>
        <button onClick={props.onCreateSlate}>Create</button>
        <button onClick={props.onToggleCreateSlate}>Cancel</button>
      </form>
    </div>
  );
}

export default class Slates extends Component {
  state = {
    slateName: "",
    slateColor: "",
    showForm: false,
    showError: false,
    showSlateSettings: false
  };

  handleSlateInputChange = (val, name) => this.setState({ [name]: val });

  handleToggleCreateSlate = () =>
    this.setState(state => ({ showForm: !state.showForm }));

  handleCreateSlate = () => {
    const { slateName, slateColor } = this.state;

    if (!slateName) {
      this.setState({ showError: true });
      return;
    }

    this.props.onCreateSlate(slateName, slateColor, Date.now());

    this.setState({
      slateName: "",
      slateColor: "",
      showForm: false,
      showError: false
    });
  };

  handleDeleteSlate = id => {
    this.props.onDeleteSlate(id);
  };

  handleToggleSlateSettings = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState(state => ({ showSlateSettings: !state.showSlateSettings }));
  };

  render() {
    const { slates = [] } = this.props;
    const { projectName, showForm, showError, showSlateSettings } = this.state;

    return (
      <Fragment>
        <Wrapper>
          <h1>Slates</h1>
          <p>Your Slates</p>
          <div>
            {showForm ? (
              <NewSlate
                projectName={projectName}
                onSlateInputChange={this.handleSlateInputChange}
                onToggleCreateSlate={this.handleToggleCreateSlate}
                onCreateSlate={this.handleCreateSlate}
                showError={showError}
              />
            ) : (
              <button onClick={this.handleToggleCreateSlate}>
                Create New Slate
              </button>
            )}
          </div>
        </Wrapper>
        <ul
          css={{
            display: "flex",
            overflowX: "scroll",
            "& ::-webkit-scrollbar": {
              width: 0
            }
          }}
        >
          {slates.map(({ name, id }, idx) => (
            <li key={id}>
              <Link
                to={{
                  pathname: `/slate/${id}`,
                  state: { color: slateColors[idx % slateColors.length] }
                }}
                css={{
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: "inherit",
                    textDecoration: "none"
                  }
                }}
              >
                <div
                  css={{
                    padding: "1.5625rem",
                    paddingTop: ".5rem",
                    borderRadius: 30,
                    margin: ".5rem",
                    height: 300,
                    position: "relative",
                    width: 240,
                    backgroundColor: slateColors[idx % slateColors.length],
                    color: "#fff"
                  }}
                >
                  <div
                    css={{
                      display: "flex",
                      justifyContent: "flex-end"
                    }}
                  >
                    {showSlateSettings ? (
                      <div css={{ display: "flex" }}>
                        <button
                          onClick={() => this.handleDeleteSlate(id)}
                          css={{ textDecoration: "underline" }}
                        >
                          Delete
                        </button>
                        <div>
                          <FaTimes onClick={this.handleToggleSlateSettings} />
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={this.handleToggleSlateSettings}
                        css={{ fontSize: ".5rem" }}
                      >
                        <FaCircle />
                        <FaCircle />
                        <FaCircle />
                      </div>
                    )}
                  </div>
                  <div
                    css={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "3rem",
                      textDecoration: "none"
                    }}
                  >
                    {name}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Fragment>
    );
  }
}
