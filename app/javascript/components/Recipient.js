import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Filings from './Filings';
import RecipientAwards from './RecipientAwards';

// TODO: we don't really need axios, just use fetch API
import axios from 'axios';

const RecipientData = ({ recipient }) => {
  return (
    <>
      <div class="row">
        <div class="twelve columns">
          <strong>Recipient:</strong>
          <p>
            { recipient.name }<br/>
            { recipient.address_line_1 }, { recipient.address_city }, { recipient.address_state } { recipient.address_zip }
          </p>
        </div>
      </div>
      <div class="row">
        <div class="three columns">
          <strong>EIN:</strong>
          <p>
            { recipient.ein }
          </p>
        </div>
      </div>
    </>
  );
};

export default function Recipient({ recipient }) {
  const { id } = useParams();

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getData = async (id) => {
    setIsLoading(true);
    const response = await axios.get(`/api/recipients/${id}`);
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
      <h3>Recipient (ID {id})</h3>
      <div>
        { isLoading ? loadingState : <RecipientData recipient={ data } /> }
      </div>
      { isLoading ? loadingState : <RecipientAwards
        recipientId={ id }
      /> }
    </>
  );
}

