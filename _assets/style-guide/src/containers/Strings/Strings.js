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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ComponentItem from '../../views/ComponentItem';
import Select from 'react-select';

export default class StringsView extends Component {
  static contextTypes = {
    intl: PropTypes.object
  }

  handleLocaleChange(option) {
    console.log(option);  // eslint-disable-line
    console.log(this.context.intl);  // eslint-disable-line
    //const translate = this.context.translate;
    //translate.setLocale(option.value);
    //this.forceUpdate();
  }

  render() {
    const validLocales = [{
      value: 'en',
      label: 'English (US)'
    }, {
      value: 'en-GB',
      label: 'English (UK)'
    }, {
      value: 'da',
      label: 'Dansk'
    }, {
      value: 'de',
      label: 'Deutsch'
    }, {
      value: 'es',
      label: 'Español'
    }, {
      value: 'fr',
      label: 'Français'
    }, {
      value: 'it',
      label: 'Italiano'
    }, {
      value: 'ja',
      label: '日本語'
    }, {
      value: 'ko',
      label: '한국어'
    }, {
      value: 'no',
      label: 'Norsk'
    }, {
      value: 'pt-br',
      label: 'Portuguese'
    }, {
      value: 'ru',
      label: 'русский'
    }, {
      value: 'sv',
      label: 'Svenska'
    }, {
      value: 'th',
      label: 'ไทย'
    }, {
      value: 'tr',
      label: 'Türkçe'
    }, {
      value: 'zh-CN',
      label: '中文(简体)'
    }, {
      value: 'zh-HK',
      label: '中文(繁體)'
    }];

    const locale = this.context.intl.locale;

    return (
      <section id="StringsView">
        <h1>Strings</h1>
        <p>Please refer to <a href="https://github.com/yahoo/react-intl" target="_blank">React Intl</a> for full documentation. See <a href="http://formatjs.io/guides/message-syntax/" target="_blank">Message Syntax</a> for documentation about string formats.</p>

        <h3>String Formatting</h3>
        <p>When adding new strings, please use the following key format:</p>
        <ul>
          <li><code>word</code> - Word</li>
          <li><code>multiple-words-with-spaces</code> - Multiple words with spaces</li>
          <li><code>new-feature-description</code> - A description of an exciting new feature.</li>
          <li><code>new-feature-note</code> - A short note about a feature.</li>
        </ul>

        <h3>Change locale</h3>
        <Select
          value={locale}
          options={validLocales}
          onChange={::this.handleLocaleChange}
          clearable={false}
          style={{ marginBottom: '1rem' }}
        />

        <h3>FormattedMessage</h3>
        <h3>PropTypes</h3>
        <ul>
          <li><strong>id</strong> <code>string</code> - translation key</li>
          <li><strong>description</strong> <code>string</code> - optional description of string to assist translators</li>
          <li><strong>defaultMessage</strong> <code>string</code> - US English string</li>
          <li><strong>values</strong> <code>string</code> - variables to pass to message</li>
        </ul>
        <ComponentItem>
          <FormattedMessage
            id="hello"
            description="Welcome greeting to the user"
            defaultMessage="Hello, {name}! How are you today?"
            values={{ name: 'Gregory' }}
          />
        </ComponentItem>
      </section>
    );
  }
}
