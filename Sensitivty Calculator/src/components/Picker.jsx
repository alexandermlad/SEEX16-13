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

export default class Picker extends Component {
  render() {
    const { value, onChange, options } = this.props;

    return (
      <span>
        <select onChange={e => onChange(e.target.value)} value={value}>
          {' '}
          {options.map(option => (
            <option value={option[0]} key={option}>
              {' '}
              {option[1]}{' '}
            </option>
          ))}{' '}
        </select>{' '}
      </span>
    );
  }
}

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string.isRequired)).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
