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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */
import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Select from 'react-select';

import Checkbox from 'components/Checkbox/Checkbox';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import Loader from 'components/Loader/Loader';

/**
 * SAML
 */
export default class SAML extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    enabled: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    //Link
    SpPublicCertificate: PropTypes.string,

    //Link
    SpRolloverCertificate: PropTypes.string,

    //Link
    SpMetadata: PropTypes.string,

    //radio custom value
    singleSignOnBindingRedirect: PropTypes.string,

    //radio custom value
    singleSignOnBindingPost: PropTypes.string,

    //radio custom value
    singleSignOffBindinggRedirect: PropTypes.string,

    //radio custom value
    singleSignOffBindingPost: PropTypes.string,

    //radio result value
    singleSignOnBinding: PropTypes.string,

    //radio result value
    singleSignOffBinding: PropTypes.string,

    entityId: PropTypes.string,

    singleSignOnUrl: PropTypes.string,

    singleSignOffUrl: PropTypes.string,

    x509PublicCertificate: PropTypes.string,

    //checkbox value accept 1 or 0
    signMessages: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    //checkbox value accept 1 or 0
    signAssertions: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    //checkbox value accept 1 or 0
    encryptNameId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    //checkbox value accept 1 or 0
    replaceUserMetadataOnReauth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    selectedDnsAlias: PropTypes.string,
    dnsAliases: PropTypes.array,
    onDnsAliasChange: PropTypes.func,
    samlLoading: PropTypes.bool,

    onChange: PropTypes.func,

    isMetadataFileUploading: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    singleSignOnBindingRedirect: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
    singleSignOnBindingPost: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
    singleSignOffBindingRedirect: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
    singleSignOffBindingPost: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.fileUpload = null;
    this.links = ['SpPublicCertificate', 'SpRolloverCertificate', 'SpMetadata'];
    this.radios = ['singleSignOnBinding', 'singleSignOffBinding'];
    this.texts = ['entityId', 'singleSignOnUrl', 'singleSignOffUrl'];
    this.checkboxs = ['signMessages', 'signAssertions', 'encryptNameId', 'replaceUserMetadataOnReauth'];

    this.handleDebounceChange = _compose(
      _debounce(props.onChange.bind(this), 300),
      _clone
    );
    autobind(this);
  }

  handleChange(e) {
    const { dataset } = e.currentTarget;
    this.fileUpload.value = '';
    if (dataset.action === 'upload' && !this.props.isMetadataFileUploading) {
      this.fileUpload.click();
    }
  }

  render() {
    const {
      strings,
      enabled,
      x509PublicCertificate,
      isMetadataFileUploading,
      onChange,
      currentSelectedDnsAlias,
      onDnsAliasChange,
      dnsAliases,
      samlLoading
    } = this.props;
    const styles = require('./SAML.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      SAML: true,
      disabled: isMetadataFileUploading
    }, this.props.className);

    const dnsOptions = dnsAliases.map(item => ({
      value: item.id,
      label: item.alias
    }));

    return (
      <div className={classes} style={this.props.style}>
        <section className={styles.dnsAlias}>
          <h3>{strings.dnsAlias}</h3>
          <Select
            className={styles.dnsAliasSelect}
            name="fixed"
            value={currentSelectedDnsAlias}
            options={dnsOptions}
            searchable={false}
            clearable={false}
            placeholder="Choose one value!"
            onChange={onDnsAliasChange}
          />
          <p>{strings.samlSettingNote}</p>
        </section>

        <h3>{`${strings.saml} 2.0`}</h3>
        <Checkbox
          label={strings.enableSAML}
          className={styles.enableSAML}
          name="enabled"
          value="enabled"
          checked={enabled === 1}
          onChange={onChange}
        />
        <section className={styles.spCertificate}>
          <table>
            <tbody>
              {this.links.map(obj => (
                <tr key={obj}>
                  <td className={styles.label}>{strings[obj]}</td>
                  <td className={styles.link}><a href={this.props[obj]}>{strings[`download${obj}`]}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className={styles.samlIdpMetadata}>
          <h3>{strings.samlIdpMetadata}</h3>
          <p>{strings.samlIdpMetadataInfo}</p>
          {this.radios.map(obj => (
            <RadioGroup
              legend={strings[obj]}
              key={obj}
              name={obj}
              selectedValue={this.props[obj] || this.props[obj + 'Redirect']}
              className={styles.samlRadioGroup}
              onChange={onChange}
              options={[{
                label: strings.redirect,
                value: this.props[obj + 'Redirect']
              }, {
                label: strings.post,
                value: this.props[obj + 'Post']
              }]}
            />
          ))}
          <div className={styles.metadataFile}>
            {isMetadataFileUploading && <Loader type="content" className={styles.metadataFileLoading} />}
            <div
              onClick={this.handleChange} //import metadata file
              data-action="upload"
              className={styles.importMetadataFile}
            >
              {strings.importMetadataFile}
            </div>
            <input
              ref={(c) => { this.fileUpload = c; }}
              type="file"
              name="idpMetadataFile"
              id="idpMetadataFile"
              accept="text/xml"
              className={styles.hidden}
              onChange={onChange}
            />
            <div className={styles.metadataOverwriteInfo}>{strings.metadataOverwriteInfo}</div>
            <div className={styles.inputs}>
              {this.texts.map(obj => (
                <Text
                  key={obj}
                  id={obj}
                  defaultValue={this.props[obj]}
                  disabled={isMetadataFileUploading}
                  label={strings[obj]}
                  className={styles.samlInput}
                  onChange={this.handleDebounceChange}
                />
              ))}
              <Text
                id="x509PublicCertificate"
                label={strings.x509PublicCertificate}
                rows={10}
                disabled={isMetadataFileUploading}
                defaultValue={x509PublicCertificate}
                onChange={this.handleDebounceChange}
                textArea
              />
            </div>
          </div>
          <h3>{strings.samlOtherIdpSettings}</h3>
          {this.checkboxs.map(obj => (
            <Checkbox
              key={obj}
              label={strings[obj]}
              className={styles.otherSettings}
              name={obj}
              value={obj}
              checked={this.props[obj] === 1}
              onChange={onChange}
            />
          ))}
          {samlLoading && <section className={styles.loader}>
            <Loader type="page" />
          </section>}
        </section>
      </div>
    );
  }
}
