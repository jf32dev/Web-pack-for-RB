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
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Loader from 'components/Loader/Loader';
/**
  * AppReceiver iframe with loading indicator.
  */
export default class AppViewer extends PureComponent {
   static propTypes = {
     /** iframe `src` */
     baseUrl: PropTypes.string,
     /** referrer path */
     referrer: PropTypes.string,
     /** iframe `allowFullScreen` */
     allowFullScreen: PropTypes.bool,
     /** iframe 'load' event */
     onLoad: PropTypes.func,
     /** iframe 'error' event */
     onError: PropTypes.func,
     className: PropTypes.string,
     style: PropTypes.object
   };

   static defaultProps = {
     referrer: '*',
     allowFullScreen: true
   };

   constructor(props) {
     super(props);
     this.state = {
       loaded: false
     };
     //ref
     this.btcFrame = null;
     autobind(this);
   }

   handleLoad(event) {
     this.setState({
       loaded: true
     });
     if (typeof this.props.onLoad === 'function') {
       this.props.onLoad(event);
     }
   }

   render() {
     const { loaded } = this.state;
     const {
       baseUrl,
       referrer
     } = this.props;
     const styles = require('./AppViewer.less');
     const cx = classNames.bind(styles);
     const classes = cx({
       AppViewer: true
     }, this.props.className);
     const baseUrl2 = 'http://localhost:3009';
     // js-bridge params
     const params = `?action=postMessage&referrer=${referrer}`;
     const frameSrc = baseUrl2 + params;
     //remove sandbox because the server need to config it
     return (
       <div tabIndex="-1" className={classes} style={this.props.style}>
         {!loaded && <div className={styles.loader}>
           <Loader type="content" />
         </div>}
         {baseUrl2 && <iframe
           ref={elem => { this.btcFrame = elem; }}
           src={frameSrc}
           height="100%"
           width="100%"
           allowFullScreen={this.props.allowFullScreen}
           seamless
           onLoad={this.handleLoad}
           onError={this.props.onError}
         />}
       </div>
     );
   }
}
