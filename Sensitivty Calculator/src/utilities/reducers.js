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
import { combineReducers } from 'redux';
import { FluxConversions } from './utilities/fluxConversions';

import {
  SELECT_OCTILE,
  REQUEST_OCTILE,
  FAILED_OCTILE,
  RECEIVE_OCTILE,
  UPDATE_DECLINATION,
  UPDATE_FREQUENCY,
  UPDATE_FREQUENCY_UNIT,
  RESCALE_FREQUENCY_UNIT,
  UPDATE_BANDWIDTH,
  UPDATE_BANDWIDTH_UNIT,
  RESCALE_BANDWIDTH_UNIT,
  UPDATE_POLARISATION,
  UPDATE_OCTILE_SELECTION_OPTION,
  ARRAY_12M,
  ARRAY_7M,
  ARRAY_TP,
  UPDATE_SENSITIVITY,
  UPDATE_SENSITIVITY_UNIT,
  UPDATE_SENSITIVITY_AND_UNIT,
  RESCALE_SENSITIVITY_UNIT,
  UPDATE_TIME,
  UPDATE_TIME_UNIT,
  UPDATE_TIME_AND_UNIT,
  RESCALE_TIME_UNIT,
  UPDATE_RESOLUTION,
  UPDATE_RESOLUTION_UNIT,
  RESCALE_RESOLUTION_UNIT,
  UPDATE_TWELVE_ANTENNAS,
  UPDATE_SEVEN_ANTENNAS,
  UPDATE_TOTAL_POWER_ANTENNAS,
  UPDATE_INTEGRATION_UNIT_OPTION,
  UPDATE_SENSITIVITY_UNIT_OPTION,
  SELECT_BAND,
  RECEIVE_BAND
} from './actions';

const frequencyUnitToScale = {
  Hz: 0.000000001,
  kHz: 0.000001,
  MHz: 0.001,
  GHz: 1
};
const sensitivityUnitToScale = {
  uJy: 1.0e-6,
  mJy: 0.001,
  Jy: 1,
  K: 1,
  mK: 0.001
};
const timeUnitToScale = {
  ns: 1.0e-9,
  us: 1.0e-6,
  ms: 0.001,
  s: 1,
  min: 60,
  h: 3600,
  d: 86400
};
const resolutionUnitToScale = {
  arcsec: 1,
  mas: 0.001
};

function availableBands(state = [["ALMA_RB_07","ALMA_RB_07"]], action) {
  switch (action.type) {
    case RECEIVE_BAND:
      const items = action.observingBandDetails.result.items;
      const newList = [];
      if (items.length > 0) {
        for (var i=0; i < items.length; i++){
          console.log(newList);
          newList[i] = [items[i],items[i]];
        }
        return newList;
      } else {
        return [['Unknown','Unknown']];
      }
    default:
      return state;
  }
}

function selectedBand(state = 'ALMA_RB_07', action) {
  switch (action.type) {
    case RECEIVE_BAND:
      console.log(action.observingBandDetails);
      const items = action.observingBandDetails.result.items;
      console.log(items);
      if (items.length > 0){
        return items[0];
      } else {
        return 'Unknown';
      }
    case SELECT_BAND:
      return action.band;
    default:
      return state;
  }
}

function selectedOctile(state = '3', action) {
  switch (action.type) {
    case RECEIVE_OCTILE:
      return action.octileDetails.result.id;
    case SELECT_OCTILE:
      return action.octile;
    default:
      return state;
  }
}

function declination(
  state = {
    formattedValue: ' 00:00:00.00',
    inMas: 0,
    inDegrees: 0,
    isValid: true,
    validationError: ''
  },
  action
) {
  switch (action.type) {
    case UPDATE_DECLINATION:
      return action.declination;
    default:
      return state;
  }
}

function frequency(
  state = {
    value: '345',
    unit: 'GHz',
    scale: 1
  },
  action
) {
  var newScale;
  var newValue;

  switch (action.type) {
    case RECEIVE_OCTILE:
      return Object.assign({}, state, {
        isValid: true,
        validationError: ''
      });
    case FAILED_OCTILE:
      if (action.octileDetails.result.message.startsWith('Invalid frequency:')) {
        return Object.assign({}, state, {
          isValid: false,
          validationError: action.octileDetails.result.message
        });
      }
      if (action.octileDetails.result.message.startsWith('Unknown frequency:')) {
        return Object.assign({}, state, {
          isValid: false,
          validationError: action.octileDetails.result.message
        });
      }
      return state;
    case UPDATE_FREQUENCY:
      return Object.assign({}, state, {
        value: action.value
      });
    case UPDATE_FREQUENCY_UNIT:
      newScale = frequencyUnitToScale[action.unit];
      return Object.assign({}, state, {
        scale: newScale,
        unit: action.unit
      });
    case RESCALE_FREQUENCY_UNIT:
      newScale = frequencyUnitToScale[action.unit];
      newValue = (state.value * state.scale) / newScale;
      newValue = FluxConversions.round(newValue, 5);
      return Object.assign({}, state, {
        value: newValue,
        scale: newScale,
        unit: action.unit
      });
    default:
      return state;
  }
}

function bandwidth(
  state = {
    value: '7.500000',
    unit: 'GHz',
    scale: 1,
    isValid: true
  },
  action
) {
  var newScale;
  var newValue;

  switch (action.type) {
    case UPDATE_BANDWIDTH:
      return Object.assign({}, state, {
        value: action.value
      });
    case UPDATE_BANDWIDTH_UNIT:
      newScale = frequencyUnitToScale[action.unit];
      return Object.assign({}, state, {
        scale: newScale,
        unit: action.unit
      });
    case RESCALE_BANDWIDTH_UNIT:
      newScale = frequencyUnitToScale[action.unit];
      newValue = (state.value * state.scale) / newScale;
      newValue = FluxConversions.round(newValue, 5);
      return Object.assign({}, state, {
        value: newValue,
        scale: newScale,
        unit: action.unit
      });
    default:
      return state;
  }
}

function determineNewSensitivityState(state, action) {
  var newScale;
  var newValue;

  switch (action.type) {
    case UPDATE_SENSITIVITY_AND_UNIT:
      newScale = sensitivityUnitToScale[action.unit];
      return Object.assign({}, state, {
        scale: newScale,
        value: action.value,
        unit: action.unit,
        altValue: action.altValue,
        altUnit: action.altUnit
      });
    case UPDATE_SENSITIVITY:
      return Object.assign({}, state, {
        value: action.value,
        altValue: action.altValue,
        altUnit: action.altUnit
      });
    case UPDATE_SENSITIVITY_UNIT:
      newScale = sensitivityUnitToScale[action.unit];
      return Object.assign({}, state, {
        scale: newScale,
        unit: action.unit
      });
    case RESCALE_SENSITIVITY_UNIT:
      newScale = sensitivityUnitToScale[action.unit];
      newValue = (state.value * state.scale) / newScale;
      newValue = FluxConversions.round(newValue, 5);
      return Object.assign({}, state, {
        value: newValue,
        scale: newScale,
        unit: action.unit
      });
    default:
      return state;
  }
}

function twelveSensitivity(
  state = {
    value: '197.67559092477822',
    unit: 'uJy',
    altValue: Infinity,
    altUnit: 'K',
    scale: 1.0e-6
  },
  action
) {
  return action.arrayInstance === ARRAY_12M ? determineNewSensitivityState(state, action) : state;
}

function sevenSensitivity(
  state = {
    value: '2.4826852653365648',
    unit: 'mJy',
    altValue: Infinity,
    altUnit: 'K',
    scale: 0.001
  },
  action
) {
  return action.arrayInstance === ARRAY_7M ? determineNewSensitivityState(state, action) : state;
}

function totalPowerSensitivity(
  state = {
    value: '4.85010668201959',
    unit: 'mJy',
    altValue: '0.174',
    altUnit: 'mK',
    scale: 0.001
  },
  action
) {
  return action.arrayInstance === ARRAY_TP ? determineNewSensitivityState(state, action) : state;
}

function determineNewTimeState(state, action) {
  var newScale;
  var newValue;

  switch (action.type) {
    case UPDATE_TIME:
      return Object.assign({}, state, {
        value: action.value
      });
    case UPDATE_TIME_AND_UNIT:
      newScale = timeUnitToScale[action.unit];
      return Object.assign({}, state, {
        value: action.value,
        scale: newScale,
        unit: action.unit
      });
    case UPDATE_TIME_UNIT:
      newScale = timeUnitToScale[action.unit];
      return Object.assign({}, state, {
        scale: newScale,
        unit: action.unit
      });
    case RESCALE_TIME_UNIT:
      newScale = timeUnitToScale[action.unit];
      newValue = (state.value * state.scale) / newScale;
      newValue = FluxConversions.round(newValue, 5);
      return Object.assign({}, state, {
        value: newValue,
        scale: newScale,
        unit: action.unit
      });
    default:
      return state;
  }
}

function twelveTime(
  state = {
    value: '60',
    unit: 's',
    scale: 1
  },
  action
) {
  return action.arrayInstance === ARRAY_12M ? determineNewTimeState(state, action) : state;
}

function sevenTime(
  state = {
    value: '60',
    unit: 's',
    scale: 1
  },
  action
) {
  return action.arrayInstance === ARRAY_7M ? determineNewTimeState(state, action) : state;
}

function totalPowerTime(
  state = {
    value: '60',
    unit: 's',
    scale: 1
  },
  action
) {
  return action.arrayInstance === ARRAY_TP ? determineNewTimeState(state, action) : state;
}

function twelveAntennas(
  state = {
    value: '43'
  },
  action
) {
  switch (action.type) {
    case UPDATE_TWELVE_ANTENNAS:
      return Object.assign({}, state, {
        value: action.value
      });
    default:
      return state;
  }
}

function sevenAntennas(
  state = {
    value: '10'
  },
  action
) {
  switch (action.type) {
    case UPDATE_SEVEN_ANTENNAS:
      return Object.assign({}, state, {
        value: action.value
      });
    default:
      return state;
  }
}

function totalPowerAntennas(
  state = {
    value: '3'
  },
  action
) {
  switch (action.type) {
    case UPDATE_TOTAL_POWER_ANTENNAS:
      return Object.assign({}, state, {
        value: action.value
      });
    default:
      return state;
  }
}

function determineNewResolutionState(state, action) {
  var newScale;
  var newValue;

  switch (action.type) {
    case UPDATE_RESOLUTION:
      return Object.assign({}, state, {
        value: action.value
      });
    case UPDATE_RESOLUTION_UNIT:
      newScale = resolutionUnitToScale[action.unit];
      return Object.assign({}, state, {
        scale: newScale,
        unit: action.unit
      });
    case RESCALE_RESOLUTION_UNIT:
      newScale = resolutionUnitToScale[action.unit];
      newValue = (state.value * state.scale) / newScale;
      newValue = FluxConversions.round(newValue, 5);
      return Object.assign({}, state, {
        value: newValue,
        scale: newScale,
        unit: action.unit
      });
    default:
      return state;
  }
}

function twelveResolution(
  state = {
    value: 0.00000,
    unit: 'arcsec',
    scale: 1
  },
  action
) {
  return action.arrayInstance === ARRAY_12M ? determineNewResolutionState(state, action) : state;
}

function sevenResolution(
  state = {
    value: 0.00000,
    unit: 'arcsec',
    scale: 1
  },
  action
) {
  return action.arrayInstance === ARRAY_7M ? determineNewResolutionState(state, action) : state;
}

function totalPowerResolution(
  state = {
    value: 9.5,
    unit: 'arcsec',
    scale: 1
  },
  action
) {
  return action.arrayInstance === ARRAY_TP ? determineNewResolutionState(state, action) : state;
}

function polarisation(state = '2', action) {
  switch (action.type) {
    case UPDATE_POLARISATION:
      return action.value;
    default:
      return state;
  }
}

function octileSelectionOption(state = 'Automatic', action) {
  switch (action.type) {
    case UPDATE_OCTILE_SELECTION_OPTION:
      return action.value;
    default:
      return state;
  }
}

function octileDetails(
  state = {
    isFetching: false,
    result: {}
  },
  action = {
    type: 'Unknown'
  }
) {
  switch (action.type) {
    case REQUEST_OCTILE:
      //update to highlight we are fetching something
      return Object.assign({}, state, {
        octile: action.octile,
        isFetching: true,
        didInvalidate: false
      });

    case RECEIVE_OCTILE:
      //update the timestamp, we have a reply and a new state
      //in the new state items is replaced with the posts from the action

      return Object.assign({}, state, {
        isFetching: false,
        //declination: action.declination,
        result: action.octileDetails.result,
        lastUpdated: action.receivedAt
      });

    case FAILED_OCTILE:
      //update the timestamp, we have a reply and a new state
      //in the new state items is replaced with the posts from the action

      return Object.assign({}, state, {
        isFetching: false,
        declination: action.declination,
        result: action.octileDetails.result,
        lastUpdated: action.receivedAt
      });

    default:
      //otherwise return the current state
      return state;
  }
}

function sensitivityUnitOption(state = 'Automatic', action) {
  switch (action.type) {
    case UPDATE_SENSITIVITY_UNIT_OPTION:
      return action.value;
    default:
      return state;
  }
}

function integrationUnitOption(state = 'Automatic', action) {
  switch (action.type) {
    case UPDATE_INTEGRATION_UNIT_OPTION:
      return action.value;
    default:
      return state;
  }
}

//combine into a single reducer
const rootReducer = combineReducers({
  octileDetails,
  octileSelectionOption,
  selectedOctile,
  declination,
  frequency,
  selectedBand,
  availableBands,
  bandwidth,
  polarisation,
  twelveSensitivity,
  sevenSensitivity,
  totalPowerSensitivity,
  twelveResolution,
  sevenResolution,
  totalPowerResolution,
  twelveTime,
  sevenTime,
  totalPowerTime,
  twelveAntennas,
  sevenAntennas,
  totalPowerAntennas,
  sensitivityUnitOption,
  integrationUnitOption
});

export default rootReducer;
