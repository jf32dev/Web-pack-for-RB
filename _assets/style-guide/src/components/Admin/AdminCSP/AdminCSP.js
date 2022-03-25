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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huange@bigtincan.com>
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import AdminTable from './AdminTable';
import AdminFormField from 'components/Admin/AdminUtils/FormField/FormField';
import EnableMenu from './EnableMenu';
import Btn from 'components/Btn/Btn';
/**
 * Admin Content Security Policy
 */
export default class AdminCSP extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,
    /** data */
    list: PropTypes.array,

    settings: PropTypes.object,

    isAddDisabled: PropTypes.bool,

    onAdd: PropTypes.func,

    onRemove: PropTypes.func,

    onUpdate: PropTypes.func,

    onHandleSaveChange: PropTypes.func,

    onHandleGlobalSettingsChange: PropTypes.func,

    onHandleWhiteListUrlChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,

    isSettingsChanged: PropTypes.bool
  };

  static defaultProps = {
    strings: {
      contentSecurityPolicy: 'Content Security Policy',
      contentSecurityPolicyDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, pellentesque sit amet dapibus nulla.',
      warning: 'Warning',
      warningDesc: 'Any rules and options you apply may impact existing custom applications and content. Please be aware of how changes to your Content Security Policy will affect your company.',
      url: 'URL',
      options: 'Options',
      allow: 'Allow',
      remove: 'Remove',
      addUrl: 'Add URL',
      scripts: 'Scripts',
      apiCalls: 'API calls',
      stylesheets: 'Stylesheets',
      images: 'Images',
      media: 'Media',
      fonts: 'Fonts',
      globalSettings: 'Global Settings',
    },
    list: [],
    settings: {},
    // TODO - Replace to strings translation
    globalDesc: '\'allow-modals\':\nAllows embedded custom apps and content to show modal dialogs to the user.\n\n\'allow-forms\':\nAllows embedded custom apps and content to submit forms.\n\n\'unsafe-inline\':\nAllows the use of inline resources, such as inline <script> elements, javascript: URLs, inline event handlers.\n\n\'script:unsafe-eval\':\nAllows the use of eval() and similar methods for creating code from strings.',
    optionDesc: '\'scripts\':\nDefines valid sources of JavaScript.\n\n\'apiCalls\':\nApplies to XMLHttpRequest (AJAX), WebSocket or EventSource. If not allowed the browser emulates a 400 HTTP status code.\n\n\'stylesheets\':\nAllows sources of stylesheets. \n\n\'images\':\nAllows sources of images.\n\n\'media\':\nAllows sources of audio and video, eg HTML5 <audio>, <video> elements.',
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleWhiteListChange({ name }, e) {
    const { dataset } = e.currentTarget;
    const id = dataset.id;
    this.props.onHandleWhiteListUrlChange({ id, name });
  }

  handleCheckboxClick(result) {
    this.props.onHandleWhiteListUrlChange(result);
  }

  handleDeleteClick(e) {
    const { dataset } = e.currentTarget;
    this.props.onRemove(dataset.id);
  }

  render() {
    const {
      className,
      strings,
      onAdd,
      list,
      isAddDisabled,
      settings,
      globalDesc,
      optionDesc,
      isSettingsChanged
    } = this.props;
    const styles = require('./AdminCSP.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminCSP: true,
    }, className);

    const tipClasses = cx({
      longTip: true,
    }, className);

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.headerContainer}>
          <h3>{strings.contentSecurityPolicy}</h3>
          <Btn
            large
            inverted
            disabled={!isSettingsChanged}
            id="save"
            onClick={this.props.onHandleSaveChange}
          >
            {strings.save}
          </Btn>
        </div>
        <h5>{strings.contentSecurityPolicyDesc}</h5>
        <h5><span className={styles.red}>{strings.warning}: </span>{strings.warningDesc}</h5>
        <h4>{strings.globalSettings}<i aria-label={globalDesc} className={tipClasses}><i className="icon-info" /></i></h4>
        <EnableMenu
          strings={strings}
          className={styles.globalMenu}
          onClick={this.props.onHandleGlobalSettingsChange}
          checkboxList={Object.keys(settings)}
          value={settings}
        />
        <AdminTable
          headers={[strings.url, strings.options]}
          col0={{ name: 'text' }}
          col1={{ options: 'enableMenu', delete: 'btn' }}
          disabledItems={['options']}
          info={{
            [strings.options]: optionDesc
          }}
          text={<AdminFormField
            type="text"
            dataKey="name"
            id="name"
            label="https://"
            inline
            className={styles.AdminFormFieldInput}
            width="calc(100% - 4.5rem)"
          />}
          enableMenu={<EnableMenu
            strings={strings}
            onClick={this.handleCheckboxClick}
            checkboxList={['scripts', 'apiCalls', 'stylesheets', 'images', 'media', 'fonts']}
          />}
          btn={<Btn warning className={styles.remove} onClick={this.handleDeleteClick}>{strings.remove}</Btn>}
          list={list}
          onChange={this.handleWhiteListChange}
        />
        <Btn
          inverted className={styles.addUrl} disabled={isAddDisabled}
          icon="plus" onClick={onAdd}
        >{strings.addUrl}</Btn>
      </div>
    );
  }
}
