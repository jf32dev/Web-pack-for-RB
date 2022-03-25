/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of BigTinCan Mobile Pty Ltd and its suppliers,
 * if any. The intellectual and technical concepts contained herein are proprietary to BigTinCan Mobile Pty Ltd and its
 * suppliers and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction of this material is strictly forbidden unless prior
 * written permission is obtained from BigTinCan Mobile Pty Ltd.
 *
 * @package style-guide
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getGeneral,
  setGeneralData,
} from 'redux/modules/admin/general';
import { createPrompt } from 'redux/modules/prompts';

import AdminCustomWelcome from 'components/Admin/AdminCustomWelcome/AdminCustomWelcome';
import Loader from 'components/Loader/Loader';

const WELCOMESCREENS = 'welcomescreens';

const messages = defineMessages({
  customWelcomeScreens: {
    id: 'custom-welcome-screens',
    defaultMessage: 'Custom Welcome Screens'
  },
  screen1: {
    id: 'screen1',
    defaultMessage: 'Screen 1',
  },
  screen2: {
    id: 'screen2',
    defaultMessage: 'Screen 2'
  },
  screen3: {
    id: 'screen3',
    defaultMessage: 'Screen 3',
  },
  screen4: {
    id: 'screen4',
    defaultMessage: 'Screen 4'
  },
  screen5: {
    id: 'screen5',
    defaultMessage: 'Screen 5',
  },
  enable: {
    id: 'enable',
    defaultMessage: 'Enable'
  },
  title: {
    id: 'title',
    defaultMessage: 'Title'
  },
  acceptButton: {
    id: 'accept-button',
    defaultMessage: 'Accept Button',
  },
  done: {
    id: 'done',
    defaultMessage: 'Done'
  },
  decline: {
    id: 'decline',
    defaultMessage: 'Decline'
  },
  accept: {
    id: 'accept',
    defaultMessage: 'Accept',
  },
  description: {
    id: 'description',
    defaultMessage: 'Description'
  },
});

const defaultSlide = {
  title: '',
  description: '',
  position: 1,
  status: 'inactive'
};

@connect(state => state.admin.general, bindActionCreatorsSafe({
  getGeneral,
  setGeneralData,
  createPrompt
}))
export default class CustomWelcomeView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    buttonType: 'done',
    slides: [defaultSlide],
    status: 'active',
    type: 'welcome'
  }

  constructor(props) {
    super(props);

    this.screens = [{
      name: 'screen1',
      position: 1,
      enable: false,
      title: '',
      description: '',
    }, {
      name: 'screen2',
      position: 2,
      enable: false,
      title: '',
      description: '',
    }, {
      name: 'screen3',
      position: 3,
      enable: false,
      title: '',
      description: '',
    }, {
      name: 'screen4',
      position: 4,
      enable: false,
      title: '',
      description: '',
    }, {
      name: 'screen5',
      position: 5,
      enable: false,
      title: '',
      description: '',
    }];

    this.state = {
      selectedScreen: 'screen1',
    };

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.getGeneral) {
      this.props.getGeneral(WELCOMESCREENS);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'general-error',
        type: 'warning',
        title: 'Warning',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleChange(update) {
    const key = Object.keys(update)[0];
    let newUpdate = {};
    if (key === 'selectedScreen') {
      // console.log(update, this.screens.find(screen => screen.name === update.selectedScreen));
      this.setState({
        selectedScreen: update.selectedScreen
      });
    } else if (['description', 'title', 'enable'].indexOf(key) > -1) {
      const slideUpdate = key !== 'enable' ? update : {
        status: update[key] ? 'active' : 'inactive'
      };
      const positionOfScreen = parseInt(this.state.selectedScreen.substr(-1, 1), 10);
      const storedSlides = this.props.slides;
      if (positionOfScreen < storedSlides.length) {
        // if slides in redux store alreay contain selected screen
        newUpdate = {
          slides: storedSlides
            .map(slide => (this.state.selectedScreen !== `screen${slide.position}` ? slide : {
              ...slide,
              ...slideUpdate
            }))
        };
      } else {
        // if slides in redux store does not contain the selected screen, we need to insert the screen to slides array
        // however, if only push the screen to the array. the positon of slides will be broken.
        // So we need to fill the array by placeholders
        const newSlides = [];
        for (let index = 0; index < positionOfScreen; index += 1) {
          if (!storedSlides[index] && index !== positionOfScreen - 1) {
            // fill array by placeholders
            // change placeholder property 'position' to croccet value.
            newSlides[index] = { ...defaultSlide, position: index  + 1 };
          } else if (storedSlides[index] && storedSlides[index].position === positionOfScreen) {
            // if storedSlide is match the position value of selectedScreen, then update this element
            newSlides[index] = { ...storedSlides[index], ...slideUpdate };
          } else if (!storedSlides[index] && index === positionOfScreen - 1) {
            // if storedSlides do not contain selectedScreen, insert selectedScreen to corret position with correct position value
            newSlides[index] = { ...defaultSlide, ...slideUpdate, position: index + 1 };
          } else {
            // selected screen is contained by storedSlides, but not this current element. So just copy it to newSlides array with same index number.
            newSlides[index] = storedSlides[index];
          }
        }
        newUpdate = {
          slides: newSlides
        };
      }
    } else if (key === 'customWelcomeScreens') {
      newUpdate = {
        status: update.customWelcomeScreens ? 'active' : 'inactive'
      };
    } else if (key === 'acceptButton') {
      newUpdate = {
        buttonType: update.acceptButton
      };
    }

    if (this.props.setGeneralData && !_isEmpty(newUpdate)) {
      this.props.setGeneralData(WELCOMESCREENS, { data: JSON.stringify({
        buttonType: this.props.buttonType,
        slides: this.props.slides,
        status: this.props.status,
        type: this.props.type,
        ...newUpdate
      }) });
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      loading,
      status,
      buttonType,
      slides,
      className,
      style,
    } = this.props;

    const { selectedScreen } = this.state;

    const activeScreens = slides && slides.filter(slide => slide.status === 'active').map(slide => `screen${slide.position}`);
    const currentSlide = slides && slides.find(slide => selectedScreen === `screen${slide.position}`);
    // console.log('this.props', this.props);

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading &&
          <AdminCustomWelcome
            onChange={this.handleChange}
            strings={generateStrings(messages, formatMessage)}
            customWelcomeScreens={status === 'active'}
            acceptButton={buttonType}
            activeScreens={activeScreens}
            selectedScreen={selectedScreen}
            enable={_get(currentSlide, 'status', '') === 'active'}
            title={_get(currentSlide, 'title', '')}
            description={_get(currentSlide, 'description', '')}
          />}
      </div>
    );
  }
}
