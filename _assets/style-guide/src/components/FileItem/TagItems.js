import React, { Component } from 'react';
import autobind from 'class-autobind';
import PropTypes from 'prop-types';

export default class TagItem extends Component {
  static propTypes = {
    tags: PropTypes.array,
    onMoreClick: PropTypes.func,
    styles: PropTypes.object,
    strings: PropTypes.object,
    totalWidth: PropTypes.number,
    showAddTag: PropTypes.bool,
    showMoreTag: PropTypes.bool,
    onAddTagClick: PropTypes.func,
  };

  static defaultProps = {
    tags: [],
    showAddTag: false,
    showMoreTag: true
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleMoreClick(event) {
    event.stopPropagation();
    event.preventDefault();
    const { onMoreClick } = this.props;
    if (onMoreClick && typeof onMoreClick === 'function') {
      onMoreClick(event, this.props);
    }
  }

  renderTags() {
    const { tags, styles, strings } = this.props;
    const totalWidth = this.props.totalWidth;
    let runningWidth = 0;
    const elements = [];
    tags.sort((taga, tagb) => taga.name > tagb.name).forEach(element => {
      const { name, id } = element;
      const countWords = name.length;
      const totalWordwidth = (countWords * 7.8) + 40;
      runningWidth += totalWordwidth;
      if (runningWidth <= totalWidth) {
        elements.push(<div className={styles.tagItem} key={id}>{name}</div>);
      }
    });
    if (this.props.showMoreTag && elements.length < tags.length) {
      const more = tags.length - elements.length;
      elements.push(<div className={styles.moreTag} key={-100} onClick={this.handleMoreClick}> + {more} {strings.showMore}...</div>);
    } else if (this.props.showAddTag && elements.length === tags.length) {
      elements.push(<div className={styles.moreTag} key={-100} onClick={this.props.onAddTagClick}>{strings.addTags}...</div>);
    }
    return elements;
  }

  render() {
    const { styles } = this.props;
    return (<div className={styles.tagMain}>
      <div onClick={(event) => event.stopPropagation()} className={styles.tagContainer}>
        {this.renderTags()}
      </div>
    </div>);
  }
}
