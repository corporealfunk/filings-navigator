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
        { recipient.name }
        <br/>
        <span class="subdata">
          { recipient.address_city }, { recipient.address_state }
        </span>
      </td>
      <td>{ USDollar.format(amount) }</td>
      <td>{ purpose}</td>
    </tr>
  )
}

function Awards({ data, pagination, onSetPage, onSetLimit }) {
  return (
    <>
      <h5>Awards ({ pagination.total_records })</h5>
      <Paginator
        currentPage={ pagination.current_page }
        totalPages={ pagination.total_pages }
        nextPage={ pagination.next_page }
        prevPage={ pagination.prev_page }
        onNextPage={ () => onSetPage(pagination.next_page) }
        onPrevPage={ () => onSetPage(pagination.prev_page) }
        onFirstPage={ () => onSetPage(1) }
        onLastPage={ () => onSetPage(pagination.total_pages) }
        limit={ pagination.limit }
        onLimitChange={ (e) => onSetLimit(e.target.value) }
      />
      <table class="u-full-width">
        <thead>
          <th>Recipient</th>
          <th>Amount</th>
          <th>Purpopse</th>
        </thead>
        <tbody>
          { data.map((award) => (
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
      <Paginator
        currentPage={ pagination.current_page }
        totalPages={ pagination.total_pages }
        nextPage={ pagination.next_page }
        prevPage={ pagination.prev_page }
        onNextPage={ () => onSetPage(pagination.next_page) }
        onPrevPage={ () => onSetPage(pagination.prev_page) }
        onFirstPage={ () => onSetPage(1) }
        onLastPage={ () => onSetPage(pagination.total_pages) }
        limit={ pagination.limit }
        onLimitChange={ (e) => onSetLimit(e.target.value) }
      />
    </>
  );
}

export default function AwardsWrapper({ filingId }) {
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

  const getPage = async () => {
    setIsLoading(true);
    const { limit, page } = pageLimit;
    const response = await axios.get(`/api/filings/${filingId}/awards?page=${page}&limit=${limit}`);
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
      { isLoading ? loadingState : <Awards
        data={ data.data }
        pagination={ data.pagination }
        onSetPage={ (newPage) => updatePage(newPage) }
        onSetLimit={ (newLimit) => updateLimit(newLimit) }
      /> }
    </>
  );
}
