/**@jsx jsx */

import React, { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import {Draggable} from 'react-beautiful-dnd'
import { FaTrash} from 'react-icons/fa'

const ItemProperty = styled.div`
  padding: 0.3rem;
  border-radius: 50px;
  margin-right: 0.5rem;
  font-size: 0.6rem;
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #FFF;
  borderRadius: 10;
`;

export default class Item extends Component {
  state = {
    name: this.props.item.name || "",
    size: this.props.item.size || "",
    dueDate: this.props.item.dueDate || "",
    showUpdateForm: false
  };

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleToggleForm = e => this.setState({ showUpdateForm: true });

  handleItemUpdateSubmit = e => {
    e.preventDefault();
    const { name, size, dueDate } = this.state;
    this.props.onUpdateState("items", {
      ...this.props.item,
      name,
      size,
      dueDate
    });

    this.setState({ showUpdateForm: false });
  };

  handleDragStart = ev => {
    ev.dataTransfer.setData("text/plain", ev.target.id);
  };

  render() {
    const { name, size, dueDate, id } = this.props.item;

    return (
      <Draggable draggableId={id} index={this.props.index} >
        {
          provided => (
            <ItemContainer id={id} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          {this.state.showUpdateForm ? (
            <form onSubmit={this.handleItemUpdateSubmit}>
              <label>
                name
                <input
                  name="name"
                  type="text"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                size
                <input
                  name="size"
                  type="text"
                  value={this.state.size}
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                dueDate
                <input
                  name="dueDate"
                  type="date"
                  value={this.state.dueDate}
                  onChange={this.handleInputChange}
                />
              </label>
              <button type="submit" hidden>
                submit
              </button>
            </form>
          ) : (
            <div
              onClick={this.handleToggleForm}
              css={{ display: "flex", flexWrap: "wrap" }}
            >
              <div css={{ flexBasis: "100%", marginBottom: "1rem" }}>{name}</div>
              <ItemProperty css={{ backgroundColor: "#F9ECEC" }}>
                {size}
              </ItemProperty>
              <ItemProperty css={{ backgroundColor: "#C8D9EB" }}>
                {dueDate}
              </ItemProperty>
            </div>
          )}
            <button onClick={() => this.props.onDeleteItem(id)}>
              <FaTrash css={{ fontSize: ".7rem" }} />
            </button>
        </ItemContainer>
          )
        }
      </Draggable>
          
    );
  }
}
