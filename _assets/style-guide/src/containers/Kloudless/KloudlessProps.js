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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

/**
 * Authentication URL: https://cloudfiles.bigtincan.com/static/kloudless.authenticator.min.js
 * Original lib: https://github.com/kloudless/authenticator.js
 */

import PropTypes from 'prop-types';

export default class KloudlessProps extends Component {
    static propTypes = {
        /** This is send as 'app_id' */
        clientId: PropTypes.string.isRequired, 
        /** List of services space separate, The 'admin' flag has now been incorporated as a part of scope */
        scope: PropTypes.string,  
        /** This is send as 'sandbox' */
        developer: PropTypes.bool,  
      };

      render() {
        return null;
      }
}