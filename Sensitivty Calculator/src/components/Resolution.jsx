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

//var ReactDOM = require('react-dom');
//var DropdownButton = require('react-bootstrap').DropdownButton;
var SplitButton = require('react-bootstrap').DropdownButton;
var FormGroup = require('react-bootstrap').FormGroup;
var FormControl = require('react-bootstrap').FormControl;
var InputGroup = require('react-bootstrap').InputGroup;
var MenuItem = require('react-bootstrap').MenuItem;
var HelpBlock = require('react-bootstrap').HelpBlock;
//var MenuItem = require('react-bootstrap').MenuItem;
//var ButtonGroup = require('react-bootstrap').ButtonGroup;

export default class Resolution extends Component {
  getValidationState() {
    const {
      value,
      frequencyInGHz,
      minBaselineM,
      maxBaselineM,
      currentSensitivityType
    } = this.props;

    const maxResolution = this.calculateSyntheticBeamsizeInArcsecs(frequencyInGHz, minBaselineM);
    const minResolution = this.calculateSyntheticBeamsizeInArcsecs(frequencyInGHz, maxBaselineM);

    if (isNaN(value.value)) {
      value.validationError = 'Resolution must be a number';
      return 'error';
    }

    if (value.value < 0) {
      value.validationError = 'Resolution must be positive';
      return 'error';
    }

    //point value is always acceptible
    if (value.value === 0 || parseFloat(value.value) === 0) {
      //An angular resolution of zero is only valid if we are desling in flux
      if (currentSensitivityType === 'K' || currentSensitivityType === 'mK') {
        value.validationError = 'Angular resolution is required for temperature units';
        return 'error';
      } else {
        return 'success';
      }
    }

    //it is if there is a resolution that the bounds apply

    const resolutionInArcsecs = value.value * value.scale;

    if (minResolution > resolutionInArcsecs || maxResolution < resolutionInArcsecs) {
      value.validationError =
        'Beamsize of array ' +
        minResolution.toFixed(3) +
        ' arcsec < (resolution) < ' +
        maxResolution.toFixed(3) +
        ' arcsec for ' +
        frequencyInGHz +
        ' GHz observation ';

      return 'error';
    }
    return 'success';
  }

  calculateSyntheticBeamsizeInArcsecs(frequencyInGHz, baselineInM) {
    const GIGAHERTZ_TO_HERTZ = 1.0e9;
    const VELOCITY_C = 2.99792458e8;
    const RAD_TO_ARCSEC = 206264.806;

    const frequencyInHz = frequencyInGHz * GIGAHERTZ_TO_HERTZ;
    const wavelengthInM = VELOCITY_C / frequencyInHz;
    const arcLengthInRad = wavelengthInM / baselineInM;

    const beamsize = arcLengthInRad * RAD_TO_ARCSEC;
    return beamsize;
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
            <MenuItem eventKey={'arcsec'}> arcsec </MenuItem>{' '}
            <MenuItem eventKey={'mas'}> mas </MenuItem>{' '}
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

Resolution.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  frequencyInGHz: PropTypes.number.isRequired,
  minBaselineM: PropTypes.number.isRequired,
  maxBaselineM: PropTypes.number.isRequired,
  currentSensitivityType: PropTypes.string.isRequired
};
