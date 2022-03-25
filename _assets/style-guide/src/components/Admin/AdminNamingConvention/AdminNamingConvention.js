import PropTypes from 'prop-types';
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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Select from 'components/Select/Select';
import Text from 'components/Text/Text';
import Btn from 'components/Btn/Btn';
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';
import DiscardModal from 'components/Admin/AdminNamingConvention/DiscardModal';

const defaultNaming = require('../../../static/admin/naming.json');
const languagesOptions = require('../../../static/admin/languages.json');

/**
 * Admin Naming Convention Component for edit Custom Naming Convention information
 */
export default class AdminNamingConvention extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    naming: PropTypes.object,

    languages: PropTypes.object,

    languageCode: PropTypes.string,

    isLoaded: PropTypes.bool,

    onSave: PropTypes.func,

    onSaveNotUpdate: PropTypes.func,

    onGetLanguage: PropTypes.func,

    onEmptyError: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      tab: 'Tab',
      channel: 'Channel',
      story: 'Story',
      meeting: 'Meeting',
      singular: 'Singular',
      plural: 'Plural',
      customNamingConvention: 'Custom Naming Convention',
      language: 'Language',
      save: 'Save',
      major: 'Major',
      minor: 'Minor',
      possible: 'Possible',
      redFlag: 'Red Flag',
      yellowFlag: 'Yellow Flag',
      blueFlag: 'Blue Flag',
      storyFlags: 'Story Flags'
    },
    naming: defaultNaming,
    languages: languagesOptions,
    languageCode: 'en-gb',
    namingInputs: {
      tab: {
        singular: 'tab',
        plural: 'tabs'
      },
      channel: {
        singular: 'channel',
        plural: 'channels'
      },
      story: {
        singular: 'story',
        plural: 'stories'
      },
      meeting: {
        singular: 'meeting',
        plural: 'meetings'
      },
      storyFlags: {
        major: 'major',
        minor: 'minor',
        possible: 'possible'
      },
      empty: {}
    },
    isLoaded: true
  };

  constructor(props) {
    super(props);
    this.state = {
      inputs: {},
      isVisible: false,
      languageSelected: props.languageCode,
      emptyInputs: [],
    };

    this.temLangCode = null;
    this.customInputs = ['major', 'minor', 'possible'];
    autobind(this);
  }

  handleInputChange(e) {
    const { id, value } = e.currentTarget;
    const { emptyInputs } = this.state;
    let newEmptyInputs = emptyInputs;
    if (value === '' && emptyInputs.indexOf(id) === -1) {
      newEmptyInputs = emptyInputs.concat(id);
      if (this.props.onEmptyError) {
        this.props.onEmptyError(e);
      }
    }
    if (value !== '' && emptyInputs.indexOf(id) > -1) {
      newEmptyInputs = emptyInputs.filter(itemId => itemId !== id);
    }
    this.setState({
      inputs: {
        ...this.state.inputs,
        [id]: value
      },
      emptyInputs: newEmptyInputs
    });
  }

  handleSelectChange({ value }) {
    if (this.state.languageSelected !== value) {
      const { naming } = this.props;
      const { inputs } = this.state;
      const defaultInputs = Object.keys(naming).reduce((accumulator, key) => ({
        ...accumulator,
        [key]: naming[key].custom
      }), {});
      const isDifferent = !_isEqual(defaultInputs, { ...defaultInputs, ...inputs });
      this.temLangCode = value;
      if (isDifferent) {
        this.setState({
          isVisible: true
        });
      } else {
        this.handleModalDiscard();
      }
    }
  }

  handleSave(e, notUpdate = false) {
    const { naming } = this.props;
    const { inputs, languageSelected } = this.state;
    const defaultInputs = Object.keys(naming).reduce((accumulator, key) => ({
      ...accumulator,
      [key]: naming[key].custom
    }), {});
    if (typeof this.props.onSave === 'function') {
      this.props.onSave({
        lang_code: languageSelected,
        ...defaultInputs,
        ...inputs
      }, notUpdate);
    }
  }

  handleModalCancel() {
    this.setState({
      isVisible: false
    });

    this.temLangCode = null;
  }

  handleModalDiscard() {
    if (this.props.onGetLanguage) {
      this.props.onGetLanguage(this.temLangCode);
    }
    this.setState({
      languageSelected: this.temLangCode,
      inputs: {}
    });
    this.handleModalCancel();
  }

  handleModalSave() {
    this.handleSave(null, true);
    this.handleModalDiscard();
  }

  handleMappingKeyLabel(key) {
    let labelKey;
    switch (key) {
      case 'major':
        labelKey = 'redFlag';
        break;
      case 'minor':
        labelKey = 'yellowFlag';
        break;
      case 'possible':
        labelKey = 'blueFlag';
        break;
      default:
        break;
    }
    return labelKey;
  }

  render() {
    const { naming, namingInputs, strings, languages, isLoaded } = this.props;
    const { inputs, isVisible, languageSelected, emptyInputs } = this.state;

    const defaultInputs = Object.keys(naming).reduce((accumulator, key) => ({
      ...accumulator,
      [key]: naming[key].custom
    }), {});

    const styles = require('./AdminNamingConvention.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminNamingConvention: true
    }, this.props.className);

    const isDifferent = !_isEqual(defaultInputs, { ...defaultInputs, ...inputs });

    return (
      <div className={classes} style={this.props.style}>
        <header>
          <h3>{strings.customNamingConvention}</h3>
          <Btn
            borderless
            inverted
            disabled={!isDifferent || emptyInputs.length > 0}
            loading={!isLoaded}
            onClick={this.handleSave}
          >
            {strings.save}
          </Btn>
        </header>
        <div className={styles.language}>
          <Select
            id="languages"
            name="languages"
            className={styles.languageSelect}
            label={strings.language}
            value={languageSelected}
            options={Object.keys(languages).map(key => ({ value: key, label: languages[key] }))}
            searchable={false}
            clearable={false}
            onChange={this.handleSelectChange}
          />
        </div>
        <div className={styles.naming}>
          {Object.keys(namingInputs).map(key => (
            <div key={key} className={styles.inputs}>
              <h3>{strings[key]}</h3>
              {Object.keys(namingInputs[key]).map(namingItemKey => {
                const classObj = {};
                if (this.customInputs.includes(namingInputs[key][namingItemKey])) {
                  classObj[namingInputs[key][namingItemKey]] = true;
                }
                const inputClass = cx({
                  error: emptyInputs.indexOf(namingInputs[key][namingItemKey]) > -1,
                  ...classObj,
                }, this.props.className);

                return (<Text
                  type="text"
                  key={namingItemKey}
                  icon={this.customInputs.includes(namingInputs[key][namingItemKey]) ? 'flag-fill' : ''}
                  disabled={!isLoaded}
                  className={inputClass}
                  id={namingInputs[key][namingItemKey]}
                  label={this.customInputs.includes(namingItemKey) ? strings[this.handleMappingKeyLabel(namingItemKey)] : strings[namingItemKey]}
                  maxLength={20}
                  value={Object.prototype.hasOwnProperty.call(inputs, namingInputs[key][namingItemKey]) ?
                    _get(inputs, `${namingInputs[key][namingItemKey]}`, '') :
                    _get(naming, `${namingInputs[key][namingItemKey]}.custom`, '')
                  }
                  onChange={this.handleInputChange}
                />);
              })}
            </div>
          ))}
        </div>
        <DiscardModal
          onCancel={this.handleModalCancel}
          onDiscard={this.handleModalDiscard}
          onConfirm={this.handleModalSave}
          strings={strings}
          isVisible={isVisible}
        />
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={isDifferent} />}
      </div>
    );
  }
}
