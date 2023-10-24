import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

// TODO: we don't really need axios, just use fetch API
import axios from 'axios';

import Awards from './Awards.js';

function FilingData({ data }) {
  return (
    <>
      <div class="row">
        <div class="twelve columns">
          <strong>Filer:</strong>
          <p>
            { data.filer.name }<br/>
            { data.filer.address_line_1 }, { data.filer.address_city }, { data.filer.address_state } { data.filer.address_zip }
          </p>
        </div>
      </div>
      <div class="row">
        <div class="three columns">
          <strong>Tax Period End Date:</strong>
          <p>
            { new Date(data.tax_period_end_date).toLocaleDateString() }
          </p>
        </div>
        <div class="three columns">
          <strong>Filing Date:</strong>
          <p>
            { new Date(data.return_timestamp).toLocaleDateString() }
          </p>
        </div>
        <div class="three columns">
          <strong>Is Ammended:</strong>
          <p>
            { data.is_ammended ? 'Yes' : 'No' }
          </p>
        </div>
        <div class="three columns">
          <strong>Is Canonical (final/valid):</strong>
          <p>
            { data.is_canonical ? 'Yes' : 'No' }
          </p>
        </div>
      </div>
    </>
  );
}

export default function Filing() {
  const { id } = useParams();

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getData = async (id) => {
    setIsLoading(true);
    const response = await axios.get(`/api/filings/${id}`);
    setData(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getData(id);
  }, id);

  // TODO: pretty lame loading state
  const loadingState = <div>LOADING</div>;

  return (
    <>
      <h3>Filing {id}</h3>
      <div>
        { isLoading ? loadingState : <FilingData data={ data } /> }
      </div>
      { isLoading ? loadingState : <Awards
        filingId={ id }
      /> }
    </>
  );
}
