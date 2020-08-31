#!/usr/bin/env node
'use strict';

const moment = require('moment');
const csv = require('fast-csv');

const inputFile = process.argv[2];

function reformatTime(val) {
  return moment(val, 'HH:mm:ss').format('HH:mm');
}

function reformatDate(val) {
  return moment(val, 'YYYY-MM-DD').format('DD-MMM-yy')
}

csv
  .fromPath(inputFile, { headers: true })
  .transform(row => {
    row.Billable = row['Client'] === 'Admios Internal' ? 'Non-billable' : 'Billable';
    row['Start time'] = reformatTime(row['Start time']);
    row['Start date'] = reformatDate(row['Start date']);
    row['End date'] = reformatDate(row['End date']);
    row['End time'] = reformatTime(row['End time']);
    row.Duration = reformatTime(row.Duration);
    return row;
  })
  .pipe(csv.createWriteStream({headers: true}))
  .pipe(process.stdout);