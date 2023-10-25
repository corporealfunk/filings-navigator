import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Paginator from './Paginator.js';

function TableRow({ recipient }) {

  const recipientPath = `/recipients/${recipient.id}`;

  const navigate = useNavigate();
  return (
    <tr key={ recipient.id } onClick={ () => navigate(recipientPath) }>
      <td>
        <Link to={ recipientPath }>{ recipient.id }</Link>
      </td>
      <td>
        { recipient.name }
        <br/>
        <span class="subdata">
          { recipient.address_city }, { recipient.address_state }
        </span>
      </td>
      <td>{ recipient.ein }</td>
    </tr>
  )
}

export default function Recipients() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);

  const getData = async(page, limit) => {
    setIsLoading(true);
    const response = await axios.get(`/api/recipients?page=${page}&limit=${limit}`);
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
      <h3>Recipients ({ !isLoading && data.pagination.total_records })</h3>
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
            <th>Recipient</th>
            <th>EIN</th>
          </thead>
          <tbody className='clickable'>
            { data.data.map((recipient) => (
                <TableRow
                  recipient={recipient}
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
