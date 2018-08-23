import React, { Component } from 'react';
import { DataTable } from 'react-data-components';
import notie from 'notie'

var api = require("./gapi-handler");

export default class Table extends Component {
  renderActions =
    (val, row) =>
      <button className="btn btn-danger" onClick={() => {
        notie.confirm({
          text: `Are you sure you want to delete contact "${row.name}" (${row.email})?`
        }, () => api.deleteContact(row.link, this.props.refetchData))
      }}>
        Delete
      </button>;

  tableColumns = [
    { title: 'Name', prop: 'name' },
    { title: 'Email', prop: 'email' },
    { title: 'Actions', render: this.renderActions, className: 'text-center' },
  ];

  render() {
    const data = this.props.data || [];

    return (
      <DataTable
        className="container"
        keys="id"
        columns={this.tableColumns}
        initialData={data}
        initialPageLength={20}
        initialSortBy={{ prop: 'email' }}
        pageLengthOptions={[ 5, 20, 50 ]}
      />
    );
  }
}
