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
 * @package hub-web-app-v5
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

const parseLiveSourceEditor = (state = 'exampleValue: ""', methods = [], code, componentName) => {
  const handlers = methods ? (methods.map(mtd => (mtd + '\n')).join('\n')) : (`handleExampleChange(event) {
        this.setState({ exampleValue: event.currentTarget.value });
      }`);
  return (
    `class ${componentName} extends Component {
      constructor(props) {
        super(props);
        this.state = {
          ${state}
        };
        this.myTextRef = React.createRef();
        autobind(this);
      }

      ${handlers}

      render() {
        return (
          ${code}
        )
      }
    }`
  );
};

export default parseLiveSourceEditor;
