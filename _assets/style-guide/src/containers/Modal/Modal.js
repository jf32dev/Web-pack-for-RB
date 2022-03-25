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
import autobind from 'class-autobind';

import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';

const ModalDocs = require('!!react-docgen-loader!components/Modal/Modal.js');

export default class ModalView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalVisible2: false,
      modalVisible3: false,
      hideContent: false,
      isChecked: false
    };

    autobind(this);
  }

  handleToggleModal() {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  }

  handleToggleModal2() {
    this.setState({
      modalVisible2: !this.state.modalVisible2
    });
  }

  handleToggleModal3() {
    this.setState({
      modalVisible3: !this.state.modalVisible3
    });
  }

  handleHideContentClick() {
    this.setState({
      hideContent: !this.state.hideContent
    });
  }

  handleCheckboxChange(event) {
    this.setState({
      isChecked: event.currentTarget.checked
    });
  }

  handleClick(event) {
    console.log(event);
  }

  render() {
    return (
      <section id="ModalView">
        <h1>Modal</h1>
        <Docs {...ModalDocs} />

        <h2>Simple Example</h2>
        <p>This is a small modal that positions itself in the middle of the window.</p>
        <ComponentItem>
          <Btn onClick={this.handleToggleModal}>Launch Modal</Btn>
          <Modal
            isVisible={this.state.modalVisible}
            width="small"
            backdropClosesModal
            escClosesModal
            headerTitle="An Example Modal!"
            headerCloseButton
            footerCloseButton
            onClose={this.handleToggleModal}
          >
            <div style={{ padding: '1rem 1.5rem' }}>
              <p>I should appear in the middle of the window.</p>
              <Checkbox
                inputId="modal-checkbox"
                label="Click me!"
                name="modal-checkbox"
                value="modal-checkbox"
                checked={this.state.isChecked}
                onChange={this.handleCheckboxChange}
              />
            </div>
          </Modal>
        </ComponentItem>

        <h2>Complex Example</h2>
        <p>This example makes use of <code>headerChildren</code> and <code>footerChildren</code>.</p>
        <ComponentItem>
          <Btn onClick={this.handleToggleModal2}>Launch Modal</Btn>
          <Modal
            isVisible={this.state.modalVisible2}
            width="large"
            backdropClosesModal
            escClosesModal
            headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>Custom Header!</p>}
            footerChildren={(<div>
              <Btn alt large onClick={this.handleToggleModal2} style={{ marginRight: '0.5rem' }}>Cancel</Btn>
              <Btn inverted large onClick={this.handleToggleModal2} style={{ marginLeft: '0.5rem' }}>Save</Btn>
            </div>)}
            onClose={this.handleToggleModal2}
          >
            <div style={{ padding: '1rem 1.5rem' }}>
              <p className="note">From the Wikipedia article <a href="https://en.wikipedia.org/wiki/Elemental" target="_blank">https://en.wikipedia.org/wiki/Elemental</a></p>
              <p>An elemental is a mythic being described in occult and alchemical works from around the time of the European Renaissance and particularly elaborated in the 16th century works of Paracelsus.</p>
              <p>There are four elemental categories: gnomes, undines, sylphs, and salamanders. These correspond to the Classical elements of antiquity: earth, water, air and fire. Aether (quintessence) was not assigned an elemental.</p>
              <p>Terms employed for beings associated with alchemical elements vary by source and gloss.</p>
              <p><Btn small onClick={this.handleHideContentClick} style={{ marginLeft: '0.5rem' }}>Toggle Hide</Btn></p>

              {!this.state.hideContent && <div>
                <h2>History</h2>
                <p>The Paracelsian concept of elementals draws from several much older traditions in mythology and religion. Common threads can be found in folklore, animism, and anthropomorphism. Examples of creatures such as the Pygmy were taken from Greek mythology.</p>
                <p>The elements of earth, water, air, and fire, were classed as the fundamental building blocks of nature. This system prevailed in the Classical world and was highly influential in medieval natural philosophy. Although Paracelsus uses these foundations and the popular preexisting names of elemental creatures, he is doing so to present new ideas which expand on his own philosophical system. The homunculus is another example of a Paracelsian idea with roots in earlier alchemical, scientific, and folklore traditions.</p>

                <h2>Paracelsus</h2>
                <p>In his 16th-century alchemical work Liber de Nymphis, sylphis, pygmaeis et salamandris et de caeteris spiritibus, Paracelsus identified mythological beings as belonging to one of the four elements. Part of the Philosophia Magna, this book was first printed in 1566 after Paracelsus' death. He wrote the book to "describe the creatures that are outside the cognizance of the light of nature, how they are to be understood, what marvellous works God has created". He states that there is more bliss in describing these "divine objects" than in describing fencing, court etiquette, cavalry, and other worldly pursuits.</p>
                <p>The concept of elementals seems to have been conceived by Paracelsus in the 16th century, though he did not in fact use the term "elemental" or a German equivalent.[5] He regarded them not so much as spirits but as beings between creatures and spirits, generally being invisible to mankind but having physical and commonly humanoid bodies, as well as eating, sleeping, and wearing clothes like humans. Paracelsus gave common names for the elemental types, as well as correct names, which he seems to have considered somewhat more proper, "recht namen". He also referred to them by purely German terms which are roughly equivalent to "water people," "mountain people," and so on, using all the different forms interchangeably.</p>
              </div>}
            </div>
          </Modal>
        </ComponentItem>

        <h2>Amputated Example</h2>
        <p>This is a modal without a header or footer</p>
        <ComponentItem>
          <Btn onClick={this.handleToggleModal3}>Launch Modal</Btn>
          <Modal
            isVisible={this.state.modalVisible3}
            width="medium"
            backdropClosesModal
            escClosesModal
            onClose={this.handleToggleModal3}
          >
            <div style={{ padding: '1rem 1.5rem' }}>
              <p className="note">From the Wikipedia article <a href="https://en.wikipedia.org/wiki/Elemental" target="_blank">https://en.wikipedia.org/wiki/Elemental</a></p>
              <p>An elemental is a mythic being described in occult and alchemical works from around the time of the European Renaissance and particularly elaborated in the 16th century works of Paracelsus.</p>
              <p>There are four elemental categories: gnomes, undines, sylphs, and salamanders. These correspond to the Classical elements of antiquity: earth, water, air and fire. Aether (quintessence) was not assigned an elemental.</p>
              <p>Terms employed for beings associated with alchemical elements vary by source and gloss.</p>

              <h2>History</h2>
              <p>The Paracelsian concept of elementals draws from several much older traditions in mythology and religion. Common threads can be found in folklore, animism, and anthropomorphism. Examples of creatures such as the Pygmy were taken from Greek mythology.</p>
              <p>The elements of earth, water, air, and fire, were classed as the fundamental building blocks of nature. This system prevailed in the Classical world and was highly influential in medieval natural philosophy. Although Paracelsus uses these foundations and the popular preexisting names of elemental creatures, he is doing so to present new ideas which expand on his own philosophical system. The homunculus is another example of a Paracelsian idea with roots in earlier alchemical, scientific, and folklore traditions.</p>

              <h2>Paracelsus</h2>
              <p>In his 16th-century alchemical work Liber de Nymphis, sylphis, pygmaeis et salamandris et de caeteris spiritibus, Paracelsus identified mythological beings as belonging to one of the four elements. Part of the Philosophia Magna, this book was first printed in 1566 after Paracelsus' death. He wrote the book to "describe the creatures that are outside the cognizance of the light of nature, how they are to be understood, what marvellous works God has created". He states that there is more bliss in describing these "divine objects" than in describing fencing, court etiquette, cavalry, and other worldly pursuits.</p>
              <p>The concept of elementals seems to have been conceived by Paracelsus in the 16th century, though he did not in fact use the term "elemental" or a German equivalent.[5] He regarded them not so much as spirits but as beings between creatures and spirits, generally being invisible to mankind but having physical and commonly humanoid bodies, as well as eating, sleeping, and wearing clothes like humans. Paracelsus gave common names for the elemental types, as well as correct names, which he seems to have considered somewhat more proper, "recht namen". He also referred to them by purely German terms which are roughly equivalent to "water people," "mountain people," and so on, using all the different forms interchangeably.</p>
            </div>
          </Modal>
        </ComponentItem>

      </section>
    );
  }
}
