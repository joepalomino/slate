/** @jsx jsx */

import React, { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { collectionToArray, formatItem } from "../helpers";
import Item from "./Item";
import { FaPlus, FaTrash } from "react-icons/fa";
import {Droppable} from 'react-beautiful-dnd';

const NewItemInput = styled.input`
border: none;
background-color: #FAFAFB;
border-radius: 8px;
padding: .3rem;
width: 100%;
`;

const SizeOption = styled.div`
  display: inline-block;
  padding: .2rem .4rem;
  background: #FAFAFB;
  margin: .4rem;
  border-radius: 50px;
  &:checked {
    color: red !important;
  }
`;

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

  const { itemName, itemSize, itemDueDate, showError, sizeOptions } = props;
  return (
    <form css={{ backgroundColor: "white", borderRadius: 10, padding: "1rem" }}>
      <label>
        Name
        <NewItemInput
          type="text"
          name="itemName"
          value={itemName}
          onChange={handleInputChange}
        />
        {showError && <div>Enter Name</div>}
      </label>
        <div css={{display: 'flex'}}>
        {sizeOptions.map(option =>  <SizeOption key={option}  onClick={() => props.onNewItemSizeChange(option)} css={{color: itemSize === option ? 'blue': 'inherit'}}>{option}</SizeOption>)}
        </div>
      <label>
        Due Date:
        <NewItemInput
          type="date"
          name="itemDueDate"
          value={itemDueDate}
          onChange={handleInputChange}
        />
      </label>
      <div css={{display: 'flex', justifyContent: 'center'}}>
      <div css={{
        border: 'none',
        borderRadius: 50,
        backgroundColor: '#FAFAFB'
      }}>
        <button type="submit" onClick={handleNewItemSubmit}>
          <FaPlus />
        </button>

      </div>

      </div>
 
    </form>
  );
}

export default class List extends Component {
  static sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

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

  handleItemSizeChange = val => this.setState({itemSize: val});

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
              onNewItemSizeChange={this.handleItemSizeChange}
              showError={this.state.showError}
              sizeOptions={List.sizeOptions}
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
