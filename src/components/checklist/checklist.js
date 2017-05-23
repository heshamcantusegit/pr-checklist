import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import './checklist.css';
import util from '../../utils/util';

const LOCAL_STORAGE_STATE = 'prChecklistState';

// Think of doing a dict for each checklist item of url to selected value, remove entry when all are selected and approved.
// Add ordering

class Checklist extends Component {
  constructor(props) {
    super(props);

    // Load state from local storage or initialize default
    let localStorageState = util.getObjectFromString(window.localStorage.getItem(LOCAL_STORAGE_STATE));  
    if (localStorageState) {
      this.state = localStorageState;
    } else {
      this.state = {
        'checklistItems': {
          'race conditions': false,
          'test10': false,
          'test2': false,
          'test3': false
        },
        'addingItem': false
      };
      window.localStorage.setItem(LOCAL_STORAGE_STATE, JSON.stringify(this.state));
    }
    
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
    this.toggleAddingItem = this.toggleAddingItem.bind(this);
  }
  
  componentDidUpdate() {
    // Saving state whenever this component updates.
    window.localStorage.setItem(LOCAL_STORAGE_STATE, JSON.stringify(this.state));
  } 

  addItem(item) {
    // Validate checklist item doesn't already exist.
    if (item in Object.keys(this.state['checklistItems'])) {
      return;
    }
    this.setState((prevState) => {
      return update(prevState, {
        'checklistItems': { [item]: { $set: false }}
      });
    });
  }

  removeItem(item) {
    this.setState((prevState) => {
      let newState = Object.assign({}, prevState);
      delete newState['checklistItems'][item];
      return newState;
    });
  }

  toggleItem(item) {
    this.setState((prevState) => {
      return update(prevState, {
        'checklistItems': { [item]: { $set: !prevState.checklistItems[item] }}
      });
    });
  }

  toggleAddingItem() {
    this.setState((prevState) => {
      return update(prevState, {
        'addingItem': { $set: !prevState.addingItem }
      });
    });
  }

  render() {
    let checkListItems = Object.keys(this.state.checklistItems).map((item) =>
      <ChecklistItem key={ item } name={ item } selected={ this.state.checklistItems[item] } toggleItem={ this.toggleItem } removeItem={ this.removeItem } />
    );
    return (
      <div className='checklist'>
        <ul>{ checkListItems }</ul>
        <div className='checklist__item' onClick={ this.toggleAddingItem }>+</div>
        {
          this.state.addingItem ? <ItemInput addingItem={ this.state.addingItem } toggleAddingItem={ this.toggleAddingItem } addItem={ this.addItem } /> : null
        }
      </div>
    );
  }
}

class ChecklistItem extends Component {
  constructor(props) {
    super(props);
    this._toggleItem = this._toggleItem.bind(this);
    this._removeItem = this._removeItem.bind(this);
  }

  _toggleItem() {
    this.props.toggleItem(this.props.name);
  }

  _removeItem() {
    this.props.removeItem(this.props.name);
  }

  render() {
    return (
      <li className='checklist__item'>
        <ul>
          <li className={ 'checklist__item__name' + (this.props.selected ? ' selected' : '') } onClick={ this._toggleItem }><p>{ this.props.name }</p></li>
          <li className='remove-item' onClick={ this._removeItem } />
        </ul>
      </li>
    );
  }
}

ChecklistItem.propTypes = {
  'name': PropTypes.string.isRequired,
  'selected': PropTypes.bool.isRequired,
  'toggleItem': PropTypes.func.isRequired,
  'removeItem': PropTypes.func.isRequired
};

class ItemInput extends Component {
  constructor(props) {
    super(props);
    this.state = { 'input': '' };
    this._addItem = this._addItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  _addItem() {
    this.props.addItem(this.state['input']);
    this.props.toggleAddingItem();
  }

  handleChange(event) {
    this.setState({ 'input': event.target.value });
  }

  render() {
    return (
      <div className='add-item-input'>
        <input className='add-item-input__text-field' value={ this.state.input } type='text' onChange={ this.handleChange } />
        <input className='btn add-item-input__submit-button' type='button' value='Add Item' onClick={ this._addItem } />
        <div className='close-icon' onClick={ this.props.toggleAddingItem } />
      </div>
    );
  }
}

ItemInput.propTypes = {
  'addItem': PropTypes.func.isRequired,
  'addingItem': PropTypes.bool.isRequired,
  'toggleAddingItem': PropTypes.func.isRequired
};


export default Checklist;
