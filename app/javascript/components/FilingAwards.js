import React, { useEffect, useState } from 'react';
import Paginator from './Paginator.js';

// TODO: we don't really need axios, just use fetch API
import axios from 'axios';

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function TableRow({ awardId, amount, purpose, recipient }) {
  return (
    <tr key={ awardId }>
      <td>
        { awardId }
      </td>
      <td>
        { recipient.name }
        <br/> <span class="subdata">
          { recipient.address_city }, { recipient.address_state }
        </span>
      </td>
      <td>{ USDollar.format(amount) }</td>
      <td>{ purpose}</td>
    </tr>
  )
}

export default function FilingAwards({ filingId }) {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true);

  const [pageLimit, setPageLimit] = useState({
    page: 1,
    limit: 20,
  });

  const updateLimit = (newLimit) => {
    setPageLimit({
      page: 1,
      limit: newLimit,
    });
  }

  const updatePage = (newPage) => {
    setPageLimit({
      ...pageLimit,
      page: newPage,
    });
  }

  const awardsPath = `/api/filings/${filingId}/awards`;

  const getPage = async () => {
    setIsLoading(true);
    const { limit, page } = pageLimit;
    const response = await axios.get(`${awardsPath}?page=${page}&limit=${limit}`);
    setData(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getPage();
  }, [pageLimit]);

  // TODO: pretty lame loading state
  const loadingState = <div>LOADING</div>;

  return (
    <>
      <h5>Awards ({ !isLoading && data.pagination.total_records })</h5>
      { isLoading ? null : <Paginator
        currentPage={ data.pagination.current_page }
        totalPages={ data.pagination.total_pages }
        nextPage={ data.pagination.next_page }
        prevPage={ data.pagination.prev_page }
        onNextPage={ () => updatePage(data.pagination.next_page) }
        onPrevPage={ () => updatePage(data.pagination.prev_page) }
        onFirstPage={ () => updatePage(1) }
        onLastPage={ () => updatePage(data.pagination.total_pages) }
        limit={ data.pagination.limit }
        onLimitChange={ (e) => updateLimit(e.target.value) }
        />
      }
      { isLoading ? loadingState : (
        <table class="u-full-width">
          <thead>
            <th>Id</th>
            <th>Recipient</th>
            <th>Amount</th>
            <th>Purpopse</th>
          </thead>
          <tbody>
            { data.data.map((award) => (
                <TableRow
                  awardId={award.id}
                  recipient={award.recipient}
                  amount={award.amount}
                  purpose={award.purpose}
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
        onNextPage={ () => updatePage(data.pagination.next_page) }
        onPrevPage={ () => updatePage(data.pagination.prev_page) }
        onFirstPage={ () => updatePage(1) }
        onLastPage={ () => updatePage(data.pagination.total_pages) }
        limit={ data.pagination.limit }
        onLimitChange={ (e) => updateLimit(e.target.value) }
        />
      }
    </>
  );
}
