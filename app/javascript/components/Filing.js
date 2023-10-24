import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Paginator from './Paginator.js';

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
  const [pageLoading, setPageLoading] = useState(false);

  // TODO: this is not ideal, it's just the default
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);

  const getData = async (id) => {
    setIsLoading(true);
    const response = await axios.get(`/api/filings/${id}`);
    setData(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getData(id);
  }, id);

  // TODO: our limit (per page) is hardcoded here and in the backend
  const getPage = async () => {
    setPageLoading(true);
    const response = await axios.get(`/api/filings/${id}/awards?page=${page}&limit=${limit}`);
    setData({
      ...data,
      awards: response.data,
    });
    setPageLoading(false);
  }

  // TODO: this is wonky, we are not storing limit in state
  const updateLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }

  // TODO: pretty lame loading state
  const loadingState = <div>LOADING</div>;

  const { awards } = data;

  // TODO: clean this up, lots of loading states
  return (
    <>
      <h3>Filing {id}</h3>
      <div>
        { isLoading ? loadingState : <FilingData data={ data } /> }
      </div>
      { pageLoading || isLoading ? loadingState : <Awards
        data={ awards.data }
        pagination={ awards.pagination }
      /> }
      { pageLoading || isLoading ? null : <Paginator
        currentPage={ awards.pagination.current_page }
        totalPages={ awards.pagination.total_pages }
        nextPage={ awards.pagination.next_page }
        prevPage={ awards.pagination.prev_page }
        onNextPage={ () => setPage(awards.pagination.next_page) }
        onPrevPage={ () => setPage(awards.pagination.prev_page) }
        onFirstPage={ () => setPage(1) }
        onLastPage={ () => setPage(awards.pagination.total_pages) }
        limit={ limit }
        onLimitChange={ (e) => setLimit(e.target.value) }
        /> }
    </>
  );
}
