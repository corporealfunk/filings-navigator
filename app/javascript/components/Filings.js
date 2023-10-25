import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Paginator from './Paginator.js';

function TableRow({ filingId, filer, taxPeriodEndDate, returnTimestamp, awardsCount, isCanonical }) {

  const filingPath = `/filings/${filingId}`;

  const navigate = useNavigate();
  return (
    <tr key={ filingId } onClick={ () => navigate(filingPath) }>
      <td>
        { filingId }
      </td>
      <td>
        { filer.name }
        <br/>
        <span class="subdata">
          { filer.address_city }, { filer.address_state }
        </span>
      </td>
      <td>{ new Date(taxPeriodEndDate).toLocaleDateString() }</td>
      <td>{ new Date(returnTimestamp).toLocaleDateString() }</td>
      <td>{ awardsCount }</td>
      <td>{ isCanonical && <span class="check">&#10003;</span> }</td>
    </tr>
  )
}

export default function Filings({ filerId }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  let filerScope = '';

  if (filerId) {
    filerScope = `/filers/${filerId}`;
  }

  const getData = async(page, limit) => {
    setIsLoading(true);
    const response = await axios.get(`/api${filerScope}/filings?page=${page}&limit=${limit}`);
    setData(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getData(page, limit);
  }, [page, limit]);

  // TODO: pretty lame loading state
  const loadingState = <div>LOADING</div>;

  // TODO: this seems bad, will render twice
  // maybe store limit/page state together
  const updateLimit = (limit) => {
    setLimit(limit);
    setPage(1);
  }

  return (
    <>
      <h3>Filings</h3>
      { isLoading ? null : <Paginator
        currentPage={ data.pagination.current_page }
        totalPages={ data.pagination.total_pages }
        nextPage={ data.pagination.next_page }
        prevPage={ data.pagination.prev_page }
        onNextPage={ () => setPage(data.pagination.next_page) }
        onPrevPage={ () => setPage(data.pagination.prev_page) }
        onFirstPage={ () => setPage(1) }
        onLastPage={ () => setPage(data.pagination.total_pages) }
        limit={ data.pagination.limit }
        onLimitChange={ (e) => updateLimit(e.target.value) }
        />
      }
      { isLoading ? loadingState : (
        <table class="u-full-width">
          <thead>
            <th>Id</th>
            <th>Filer</th>
            <th>Tax Year End</th>
            <th>Filing Date</th>
            <th>Awards Count</th>
            <th>Canonical</th>
          </thead>
          <tbody className='clickable'>
            { data.data.map((filing) => (
                <TableRow
                  filingId={filing.id}
                  filer={filing.filer}
                  taxPeriodEndDate={filing.tax_period_end_date}
                  returnTimestamp={filing.return_timestamp}
                  awardsCount={filing.awards_count}
                  awardsPath={filing.awards_path}
                  isCanonical={filing.is_canonical}
                />
              )
            )}
          </tbody>
        </table>
      )}
      { isLoading ? null : <Paginator
        currentPage={ data.pagination.current_page }
        totalPages={ data.pagination.total_pages }
        nextPage={ data.pagination.next_page }
        prevPage={ data.pagination.prev_page }
        onNextPage={ () => setPage(data.pagination.next_page) }
        onPrevPage={ () => setPage(data.pagination.prev_page) }
        onFirstPage={ () => setPage(1) }
        onLastPage={ () => setPage(data.pagination.total_pages) }
        limit={ data.pagination.limit }
        onLimitChange={ (e) => updateLimit(e.target.value) }
        />
      }
    </>
  );
}
