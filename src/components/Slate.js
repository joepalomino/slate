/**@jsx jsx */
import React, { Component } from "react";
import { generateUID, collectionToArray } from "../helpers";
import List from "./List";
import Slates from "./Slates";
import { Wrapper } from "./Wrapper";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { jsx } from "@emotion/core";
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

function mapItemsToList(listId, items) {
  const itemsKeys = Object.keys(items);
  return itemsKeys.reduce(
    (coll, curr) =>
      items[curr].list === listId ? { ...coll, [curr]: items[curr] } : coll,
    {}
  );
}

function NewList(props) {
  return (
    <form onSubmit={e => e.preventDefault()} css={{ flex: 1 }}>
      <label htmlFor="listName" css={{ display: "none" }}>
        Name:
      </label>
      <input
        id="listName"
        type="text"
        placeholder="List Name"
        value={props.listName}
        onChange={props.onListNameChange}
        css={{
          backgroundColor: "transparent",
          borderRadius: 50,
          border: "3px solid #000",
          padding: ".5rem",
          width: "100%",
          "&::placeholder": {
            color: "#000",
          }
        }}
      />
      {props.showError && <div>Enter list name</div>}
    </form>
  );
}

export default class Slate extends Component {
  state = {
    slateName: this.props.slate.name,
    listName: "",
    showError: false,
    showEdit: false
  };

  handleNameChange = e => this.setState({ listName: e.target.value });

  handleNewListSubmit = e => {
    if (!this.state.listName) {
      this.setState({ showError: true });
      return;
    }

    e.preventDefault();
    this.props.onCreateList(
      this.props.slate.id,
      generateUID(),
      this.state.listName
    );
    this.setState({ listName: "", showError: false });
  };

  handleNewitemsubmit = e => {
    this.props.onCreateTask(generateUID(), this.state.taskName);
  };

  handleSlateNameInputChange = e =>
    this.setState({ slateName: e.target.value });

  handleSlateUpdate = e => {
    e.preventDefault();
    this.props.onUpdateState("slates", {
      ...this.props.slate,
      name: this.state.slateName
    });

    this.setState({ showEdit: false });
  };

  toggleSlateNameUpdate = () => this.setState({ showEdit: true });

  handleGoBack = () => this.props.history.goBack();

  onDragEnd = result => {
    const {destination, source, draggableId} = result;

    if(!destination) {
      return;
    }

    if(destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const list = this.props.lists[source.droppableId];

    const newItemIds = list.items;

    newItemIds.splice(source.index, 1);
    newItemIds.splice(destination.index, 0, draggableId);

    //call function to update state
    this.props.onUpdateState('lists', {
      ...this.props.lists[source.droppableId],
      items: newItemIds
    })
  }

  render() {
    const {
      slate,
      lists,
      items,
      onCreateItem,
      onDeleteItem,
      onDeleteList,
      location: {
        state: { color }
      }
    } = this.props;
    const { listName, showError, slateName, showEdit } = this.state;

    return (
      <div>
        <div
          onClick={this.handleGoBack}
          css={{
            backgroundColor: color,
            display: "inline-block",
            padding: "1rem",
            width: 75,
            textAlign: "right",
            marginTop: "1rem",
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30
          }}
        >
          <FaArrowLeft css={{ color: "#fff" }} />
        </div>
        <Wrapper>
          {showEdit ? (
            <form onSubmit={this.handleSlateUpdate}>
              <input
                type="text"
                value={slateName}
                onChange={this.handleSlateNameInputChange}
              />
            </form>
          ) : (
            <h1 onClick={this.toggleSlateNameUpdate}>{slate.name}</h1>
          )}
          <DragDropContext onDragEnd={this.onDragEnd}>
          <ul css={{ marginBottom: "9rem" }}>
            {collectionToArray(lists).map(list => (
              <li key={list.id}>

                  <List

                  list={list}
                  items={mapItemsToList(list.id, items)}
                  onCreateItem={onCreateItem}
                  onDeleteItem={onDeleteItem}
                  onDeleteList={onDeleteList}
                  onUpdateState={this.props.onUpdateState}
                />                
              </li>
            ))}
          </ul>

          </DragDropContext>
          
        </Wrapper>
        <div
          css={{
            position: "fixed",
            width: "100%",
            bottom: 0,
            left: 0,
            right: 0,
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
            backgroundColor: color,
            padding: "1rem",
            textAlign: "center",
            display: "flex",
            alignItems: "center"
          }}
        >
          <NewList
            listName={listName}
            onListNameChange={this.handleNameChange}
            showError={showError}
          />
          <button onClick={this.handleNewListSubmit}>
            <FaPlus />
          </button>
        </div>
      </div>
    );
  }
}
