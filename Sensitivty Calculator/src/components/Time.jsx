/*******************************************************************************
 * ALMA - Atacama Large Millimeter Array
 * Copyright (c) UKATC - UK Astronomy Technology Centre, Science and Technology Facilities Council, 2011
 * (in the framework of the ALMA collaboration).
 * All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307  USA
 *******************************************************************************/
import React, { Component, PropTypes } from 'react';

//var ReactDOM=require('react-dom');
var SplitButton = require('react-bootstrap').DropdownButton;
var FormGroup = require('react-bootstrap').FormGroup;
var FormControl = require('react-bootstrap').FormControl;
var MenuItem = require('react-bootstrap').MenuItem;
var HelpBlock = require('react-bootstrap').HelpBlock;
var InputGroup = require('react-bootstrap').InputGroup;

export default class Time extends Component {
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  getValidationState() {
    const { value } = this.props;

    //point value is always acceptible
    if (this.isNumeric(value.value) && value.value > 0) {
      value.validationError = null;
      return 'success';
    }

    value.validationError = 'Must be a positive number';
    return 'error';
  }

  render() {
    const { value, onChange, onChangeUnit } = this.props;
    return (
      <FormGroup validationState={this.getValidationState()}>
        <InputGroup className="col-sm-12 last">
          <div
            style={{
              position: 'relative'
            }}
          >
            <FormControl
              type="text"
              min="0"
              value={value.value}
              onChange={e => onChange(e.target.value)}
              id="ofValue"
            />
            <FormControl.Feedback />
          </div>{' '}
          <SplitButton
            componentClass={InputGroup.Button}
            id="units"
            title={value.unit}
            onSelect={e => onChangeUnit(e)}
            pullRight
          >
            <MenuItem eventKey={'ns'}> ns </MenuItem>
            <MenuItem eventKey={'us'}> us </MenuItem>
            <MenuItem eventKey={'ms'}> ms </MenuItem>
            <MenuItem eventKey={'s'}> s </MenuItem>
            <MenuItem eventKey={'min'}> min </MenuItem>
            <MenuItem eventKey={'h'}> h </MenuItem>
            <MenuItem eventKey={'d'}> d </MenuItem>
          </SplitButton>{' '}
        </InputGroup>{' '}
        <HelpBlock>
          {' '}
          {this.getValidationState() === 'success' ? null : value.validationError}{' '}
        </HelpBlock>{' '}
      </FormGroup>
    );
  }
}

Time.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
