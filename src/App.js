import React, { Component, Fragment } from "react";
import "./App.css";
import { generateUID } from "./helpers";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Slate from "./components/Slate";
import Slates from "./components/Slates";
import Reset from "./components/Reset";

function mapStateToProps(state, id) {
  const { slates, lists, items } = state;
  const listsArr = slates[id].lists.map(id => lists[id]);

  const itemsArr = listsArr.reduce(
    (arr, curr) => [...arr, ...curr.items.map(id => items[id])],
    []
  );

  return {
    slate: { ...slates[id] },
    lists: {
      ...listsArr.reduce((obj, curr) => ({ ...obj, [curr.id]: curr }), {})
    },
    items: itemsArr.reduce((obj, curr) => ({ ...obj, [curr.id]: curr }), {})
  };
}
class App extends Component {
  state = {
    slates: {},
    lists: {},
    items: {},
    isLoading: true
  };

  handleCreateSlate = (name, color, timeStamp) => {
    const UID = generateUID();
    this.setState(state => {
      return {
        slates: {
          ...state.slates,
          [UID]: {
            id: UID,
            color,
            name,
            timeStamp,
            lists: []
          }
        }
      };
    });
  };

  handleCreateList = (id, listId, name) => {
    this.setState(state => ({
      lists: {
        ...state.lists,
        [listId]: {
          name,
          id: listId,
          items: [],
          slate: id
        }
      },
      slates: {
        ...state.slates,
        [id]: {
          ...state.slates[id],
          lists: [...state.slates[id].lists, listId]
        }
      }
    }));
  };

  handleCreateItem = item => {
    this.setState(state => ({
      items: {
        ...state.items,
        [item.id]: item
      },
      lists: {
        ...state.lists,
        [item.list]: {
          ...state.lists[item.list],
          items: [...state.lists[item.list].items, item.id]
        }
      }
    }));
  };

  handleDeleteSlate = slateId => {
    this.setState(state => {
      let { lists, slates, items } = state;

      const listsToDelete = slates[slateId].lists;

      const itemsToDelete = Object.keys(items).filter(key =>
        listsToDelete.includes(items[key].list)
      );

      listsToDelete.forEach(key => delete lists[key]);
      itemsToDelete.forEach(key => delete items[key]);

      delete slates[slateId];
      return { slates, lists, items };
    });
  };

  handleDeleteList = listId => {
    this.setState(state => {
      let { lists, slates, items } = state;

      const slateId = lists[listId].slate;

      const itemsToDelete = lists[listId].items;

      itemsToDelete.forEach(itemKey => delete items[itemKey]);

      slates = {
        ...slates,
        [slateId]: {
          ...slates[slateId],
          lists: slates[slateId].lists.filter(key => key != listId)
        }
      };

      delete lists[listId];

      return {
        slates,
        lists,
        items
      };
    });
  };

  handleDeleteItem = itemId => {
    this.setState(state => {
      let { lists, items } = state;

      const listId = items[itemId].list;

      lists = {
        ...lists,
        [listId]: {
          ...lists[listId],
          items: lists[listId].items.filter(key => key !== itemId)
        }
      };

      delete items[itemId];

      return {
        lists,
        items
      };
    });
  };

  hydrateStateWithLocalStorage = () => {
    const localStorageState = JSON.parse(localStorage.getItem("state"));

    if (localStorageState) {
      this.setState({ ...localStorageState, isLoading: false });
    }

    this.setState({ isLoading: false });
  };

  handleUpdateState = (collectionKey, updatedObj) => {
    this.setState(state => ({
      [collectionKey]: {
        ...state[collectionKey],
        [updatedObj.id]: {
          ...updatedObj
        }
      }
    }));
  };

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
  }

  componentDidUpdate() {
    localStorage.setItem("state", JSON.stringify(this.state));
  }

  render() {
    const { isLoading } = this.state;
    const slatesObj = this.state.slates;
    const slates = Object.keys(slatesObj).map(key => ({
      id: key,
      name: slatesObj[key].name,
      color: slatesObj[key].color
    }));

    return (
      <Router>
        <Fragment>
          <Reset />
          {isLoading ? (
            <div>loading...</div>
          ) : (
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Slates
                    {...props}
                    slates={slates}
                    onCreateSlate={this.handleCreateSlate}
                    onUpdateSlate={this.handleUpdateSlate}
                    onDeleteSlate={this.handleDeleteSlate}
                  />
                )}
              />

              <Route
                path="/slate/:slateId"
                render={props => (
                  <Slate
                    {...props}
                    {...mapStateToProps(this.state, props.match.params.slateId)}
                    onUpdateState={this.handleUpdateState}
                    onCreateList={this.handleCreateList}
                    onCreateItem={this.handleCreateItem}
                    onDeleteList={this.handleDeleteList}
                    onDeleteItem={this.handleDeleteItem}
                  />
                )}
              />
            </Switch>
          )}
        </Fragment>
      </Router>
    );
  }
}

export default App;
