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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import * as d3 from 'd3';
import clone from 'clone';
import deepEqual from 'deep-equal';
import uuid from 'uuid';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Legend from './Legend';
import Links from './Links';
import Nodes from './Nodes';

export default class Tree extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onClick: PropTypes.func,
    orientation: PropTypes.oneOf([
      'horizontal',
      'vertical',
    ]),
    translate: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    pathFunc: PropTypes.oneOf([
      'diagonal',
      'elbow',
    ]),
    transitionDuration: PropTypes.number,

    /* Maximum initial depth the tree should render */
    initialDepth: PropTypes.number,
    depthFactor: PropTypes.number,
    collapsible: PropTypes.bool,
    zoomable: PropTypes.bool,
    nodeSize: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    scaleExtent: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    classNames: PropTypes.object
  };

  static defaultProps = {
    onClick: () => {},
    orientation: 'horizontal',
    translate: { x: 0, y: 0 },
    pathFunc: 'diagonal',
    transitionDuration: 400,
    depthFactor: 300,
    collapsible: true,
    zoomable: true,
    scaleExtent: { min: 0.3, max: 2 },
    nodeSize: { x: 900, y: 400 },
  };

  constructor(props) {
    super(props);
    this.svg = null;
    this.legend = [];
    this.margin = { top: 8, right: 80, bottom: 7, left: 40 };
    this.zoomHandler = null;

    this.state = {
      initialRender: true,
      data: this.assignInternalProperties(clone(props.data))
    };
    autobind(this);
  }

  componentDidMount() {
    this.zoomListener(this.props);
    this.setState({ initialRender: false }); // eslint-disable-line
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Clone new data & assign internal properties
    if (!deepEqual(this.props.data, nextProps.data)) {
      this.setState({
        data: this.assignInternalProperties(clone(nextProps.data)),
      });
    }

    // If zoom-specific props change -> rebind listener with new values
    if (!deepEqual(this.props.translate, nextProps.translate)
      || !deepEqual(this.props.scaleExtent, nextProps.scaleExtent)) {
      this.zoomListener(nextProps);
    }

    // Trigger zoom on when Flag change
    if (this.props.zoomInFlag !== nextProps.zoomInFlag) { this.zoomIn(); }
    if (this.props.zoomOutFlag !== nextProps.zoomOutFlag) { this.zoomOut(); }
  }

  // Utils
  setInitialTreeDepth(nodeSet, initialDepth) {
    const { depthFactor } = this.props;
    // Normalize for fixed-depth.
    nodeSet.forEach((elem) => {
      const n = elem;
      n.data._collapsed = n.depth >= initialDepth;
      n.data.x = n.x;
      n.data.y = n.depth * depthFactor;
      n.y = n.depth * depthFactor;
    });
  }

  zoomIn() {
    const svg = d3.select(this.svg);
    if (this.zoomHandler) this.zoomHandler.scaleBy(svg, 1.2);
  }

  zoomOut() {
    const svg = d3.select(this.svg);
    if (this.zoomHandler) this.zoomHandler.scaleBy(svg, 0.75);
  }

  zoomListener(props) {
    const { zoomable, scaleExtent } = props;
    const svg = d3.select(this.svg);

    if (zoomable) {
      this.zoomHandler = d3.zoom().scaleExtent([scaleExtent.min, scaleExtent.max]).on('zoom', function () {
        svg.select('g').attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
      });
      svg.call(this.zoomHandler);
    }
  }

  assignInternalProperties(item) {
    const data = item.data || item;
    return data.map((n) => {
      const node = n;
      node.id = uuid.v4();
      node._collapsed = false;

      // Add to legend new item
      if (!this.legend.includes(node.type)) {
        this.legend.push(node.type);
      }

      // if there are children, recursively assign properties to them too
      if (node.children && node.children.length > 0) {
        node.children = this.assignInternalProperties(node.children);
        node._children = node.children;
      }
      return node;
    });
  }

  collapseNode(n) {
    const item = n.data || n;
    item._collapsed = true;
    const node = item.data || item;
    if (node._children && node._children.length > 0) {
      node._children.forEach((child) => {
        this.collapseNode(child);
      });
    }
  }

  expandNode(n) {
    const node = n.data || n;
    node._collapsed = false;
  }

  findNodesById(nodeId, n, h) {
    const nodeSet = n.data || n;
    let hits = h;
    if (hits.length > 0) {
      return hits;
    }
    hits = hits.concat(nodeSet.filter((node) => node.id === nodeId));

    nodeSet.forEach((item) => {
      const node = item.data || item;
      if (node._children && node._children.length > 0) {
        hits = this.findNodesById(nodeId, node._children, hits);
        return hits;
      }
      return hits;
    });

    return hits;
  }

  handleNodeToggle(nodeId) {
    if (this.props.collapsible) {
      const data = clone(this.state.data);
      const matches = this.findNodesById(nodeId, data, []);
      const targetNode = matches[0];
      if (targetNode._collapsed) {
        this.expandNode(targetNode);
      } else {
        this.collapseNode(targetNode);
      }
      this.setState({ data }, () => {
        this.props.onClick(clone(targetNode));
      });
    }
  }

  generateTree() {
    const {
      initialDepth,
      nodeSize,
      orientation,
    } = this.props;

    // Set graph dimensions based on total children nodes
    const tmpOrientationLarge = orientation === 'horizontal' ? [20, nodeSize.x / 3] : [nodeSize.x / 3, 20];
    const tree = d3.tree()
      .nodeSize(tmpOrientationLarge)
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.25));

    // Assigns the x and y position for the nodes
    let rootNode = d3.hierarchy(this.state.data[0], (d) => (d._collapsed ? null : d._children));
    rootNode = tree(rootNode);

    const nodes = rootNode.descendants();
    const links = rootNode.descendants().slice(1);

    // set `initialDepth` on first render if specified
    if (initialDepth !== undefined && this.state.initialRender) {
      this.setInitialTreeDepth(nodes, initialDepth);
      return { nodes: [], links: [] };
    }

    return { nodes, links };
  }

  render() {
    const { nodes, links } = this.generateTree();
    const style = require('./Tree.less');
    const {
      transitionDuration,
      nodeSize,
      orientation,
      pathFunc,
      zoomable,
      showLegend,
      className,
      strings
    } = this.props;
    const cx = classNames.bind(style);
    const classes = cx({
      graphWrapper: true,
      grabbable: zoomable
    }, className);

    const graphTopPosition = this.margin.top + (nodeSize.y / 2);

    return (
      <div className={classes}>
        {showLegend && this.legend.length > 0 && <Legend list={this.legend} strings={strings} />}
        <svg
          ref={(node) => { this.svg = node; }}
          width="100%"
          height="100%"
          className="svgContentResponsive"
          preserveAspectRatio="xMinYMin meet"
          viewBox={'0 0 ' + nodeSize.x + ' ' + nodeSize.y}
        >
          <g
            width="100%"
            height="100%"
            transform={`translate(${this.margin.left},${graphTopPosition})`}
          >
            {links.length > 0 && <Links
              orientation={orientation}
              pathFunc={pathFunc}
              linkList={links}
              transitionDuration={transitionDuration}
            />}
            {nodes.length > 0 && <Nodes
              orientation={orientation}
              transitionDuration={transitionDuration}
              textAnchor="start"
              nodeList={nodes}
              onClick={this.handleNodeToggle}
            />}
          </g>
        </svg>
      </div>
    );
  }
}
