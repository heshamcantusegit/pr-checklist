import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import './checklist.css';
import util from '../../utils/util';

const LOCAL_STORAGE_STATE = 'prChecklistState';
const DEFAULT_CHECKLIST_ITEMS = ['race_conditions', 'test10', 'test2', 'test3']

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
        // Adding ordering
        'checklistItems': DEFAULT_CHECKLIST_ITEMS,
        'checklistItemsToggled': {},
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
      return update(prevState, { 'checklistItems': { $push: [item] } });
    });
  }

  removeItem(item) {
    this.setState((prevState) => {
      return update(prevState, {
        'checklistItems': { $splice: [[prevState.checklistItems.indexOf(item), 1]] },
        'checklistItemsToggled': { $unset: [item] }
      });
    });
  }

  toggleItem(item) {
    this.setState((prevState) => {
      return update(prevState, {
        'checklistItemsToggled': { [item]: { $set: !prevState.checklistItemsToggled[item] }}
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
    let checkListItems = this.state.checklistItems.map((item, index) =>
      <ChecklistItem 
        key={ item }
        name={ item }
        index={ index }
        selected={ Boolean(this.state.checklistItemsToggled[item]) }
        toggleItem={ this.toggleItem }
        removeItem={ this.removeItem } />
    );
    return (
      <div className='checklist'>
        <ul>{ checkListItems }</ul>
        <div className='checklist__item' onClick={ this.toggleAddingItem }><i className="fa fa-plus pr-icon add-icon" /></div>
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
      <li className={ 'checklist__item' + (this.props.selected ? ' selected' : '') } onClick={ this._toggleItem }>
        <i className='pr-icon remove-icon fa fa-times' onClick={ this._removeItem } />
        <p>{ this.props.name }</p>
      </li>
    );
  }
}

ChecklistItem.propTypes = {
  'name': PropTypes.string.isRequired,
  'selected': PropTypes.bool.isRequired,
  'toggleItem': PropTypes.func.isRequired,
  'removeItem': PropTypes.func.isRequired,
  'index': PropTypes.number.isRequired,
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
        <i className='close-icon fa fa-times' onClick={ this.props.toggleAddingItem } />
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
