/** @jsx jsx */

import React, { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { collectionToArray, formatItem } from "../helpers";
import Item from "./Item";
import { FaPlus, FaTrash } from "react-icons/fa";

function NewItem(props) {
  const handleNewitemSubmit = e => {
    e.preventDefault();
    props.onNewitemsubmit();
  };

  const handleInputChange = e =>
    props.OnNewItemInputChange(e.target.name, e.target.value);

  function handleNewItemSubmit(e) {
    e.preventDefault();
    props.onNewItemSubmit();
  }

  const { itemName, itemSize, itemDueDate, onInputChange, showError } = props;
  return (
    <form css={{ backgroundColor: "white", borderRadius: 10, padding: "1rem" }}>
      <label>
        Name
        <input
          type="text"
          name="itemName"
          value={itemName}
          onChange={handleInputChange}
        />
        {showError && <div>Enter Name</div>}
      </label>
      <label>
        Size:
        <input
          type="text"
          name="itemSize"
          value={itemSize}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Due Date:
        <input
          type="date"
          name="itemDueDate"
          value={itemDueDate}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit" onClick={handleNewItemSubmit}>
        Create new Item
      </button>
    </form>
  );
}

export default class List extends Component {
  state = {
    itemName: "",
    itemSize: "",
    itemDueDate: "",
    showError: false,
    showUpdateForm: false,
    showCreateForm: false,
    listName: this.props.list.name
  };

  handleNewItemInputChange = (name, value) => this.setState({ [name]: value });

  handleCreateItem = e => {
    const { itemName, itemSize, itemDueDate } = this.state;

    if (!itemName) {
      this.setState({ showError: true });
      return;
    }
    this.props.onCreateItem(
      formatItem(itemName, itemSize, itemDueDate, this.props.list.id)
    );

    this.setState({
      itemName: "",
      itemSize: "",
      itemDueDate: "",
      showError: false,
      showCreateForm: false
    });
  };

  handleListNameInputChange = e => this.setState({ listName: e.target.value });

  handleToggleUpdate = e => this.setState({ showUpdateForm: true });

  handleListNameUpdateSubmit = e => {
    e.preventDefault();
    this.props.onUpdateState("lists", {
      ...this.props.list,
      name: this.state.listName
    });

    this.setState({ showUpdateForm: false });
  };

  handleToggleCreateItem = () =>
    this.setState(state => ({ showCreateForm: !state.showCreateForm }));

  render() {
    const {
      items,
      list: { id, name },
      onDeleteList,
      onDeleteItem
    } = this.props;
    return (
      <div
        css={{
          backgroundColor: "#FAFAFB",
          padding: "1rem",
          borderRadius: 10,
          margin: ".5rem 0"
        }}
      >
        <div css={{ display: "flex", justifyContent: "space-between" }}>
          {this.state.showUpdateForm ? (
            <form onSubmit={this.handleListNameUpdateSubmit}>
              <label>
                name:
                <input
                  type="text"
                  onChange={this.handleListNameInputChange}
                  value={this.state.listName}
                />
              </label>
            </form>
          ) : (
            <h2 onClick={this.handleToggleUpdate}>{name}</h2>
          )}
          <button onClick={() => onDeleteList(id)}>
            <FaTrash />
          </button>
        </div>

        <ul>
          {collectionToArray(items).map(item => (
            <li key={item.id}>
              <div
                css={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#FFF",
                  borderRadius: 10
                }}
              >
                <Item item={item} onUpdateState={this.props.onUpdateState} />
                <button onClick={() => onDeleteItem(item.id)}>
                  <FaTrash css={{ fontSize: ".7rem" }} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        {this.state.showCreateForm ? (
          <div>
            <NewItem
              {...this.state}
              OnNewItemInputChange={this.handleNewItemInputChange}
              onNewItemSubmit={this.handleCreateItem}
              showError={this.state.showError}
            />
            <div onClick={this.handleToggleCreateItem}>cancel</div>
          </div>
        ) : (
          <div onClick={this.handleToggleCreateItem}>
            <FaPlus /> new item
          </div>
        )}
      </div>
    );
  }
}
