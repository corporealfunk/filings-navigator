import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Paginator from './Paginator.js';

function TableRow({ filingId, filer, taxPeriodEndDate, returnTimestamp, awardsCount }) {

  const filingPath = `/filings/${filingId}`;

  const navigate = useNavigate();
  return (
    <tr key={ filingId } onClick={ () => navigate(`/filings/${filingId}`) }>
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
    </tr>
  )
}

export default function Filings() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const getData = async(page, limit) => {
    setIsLoading(true);
    const response = await axios.get(`/api/filings?page=${page}&limit=${limit}`);
    setData(response.data);
    setIsLoading(false);
  }

  // TODO: limit (per page) is hardcoded everywhere
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
      { isLoading ? loadingState : (
        <table class="u-full-width">
          <thead>
            <th>Filer</th>
            <th>Tax Year End</th>
            <th>Filing Date</th>
            <th># of Awards Given</th>
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
        /> }
    </>
  );
}
