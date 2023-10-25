import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Filings from './Filings';

// TODO: we don't really need axios, just use fetch API
import axios from 'axios';

const FilerData = ({ filer }) => {
  return (
    <>
      <div class="row">
        <div class="twelve columns">
          <strong>Filer:</strong>
          <p>
            { filer.name }<br/>
            { filer.address_line_1 }, { filer.address_city }, { filer.address_state } { filer.address_zip }
          </p>
        </div>
      </div>
      <div class="row">
        <div class="three columns">
          <strong>EIN:</strong>
          <p>
            { filer.ein }
          </p>
        </div>
      </div>
    </>
  );
};

export default function Filer({ filer }) {
  const { id } = useParams();

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getData = async (id) => {
    setIsLoading(true);
    const response = await axios.get(`/api/filers/${id}`);
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
      <h3>Filer (ID {id})</h3>
      <div>
        { isLoading ? loadingState : <FilerData filer={ data } /> }
      </div>
      { isLoading ? loadingState : <Filings
        filerId={ id }
      /> }
    </>
  );
}
