import React, { Component } from 'react';
import DocumentMeta from 'react-document-meta';
import Dropzone from 'react-dropzone';
import styles from './home.scss';

/* components */

export class Home extends Component {
  handleFiles(files) {
    console.log(files)
  }
  render() {
    return (
      <section>
        <Dropzone onDrop={this.handleFiles.bind(this)} accept="text/csv">
          <div className="drop-text">Drop csv files here or click to trigger form.</div>
        </Dropzone>
      </section>
    );
  }
}
