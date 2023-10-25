import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Paginator from './Paginator.js';

function TableRow({ filer }) {

  const filerPath = `/filer/${filer.id}`;

  const navigate = useNavigate();
  return (
    <tr key={ filer.id } onClick={ () => navigate(filerPath) }>
      <td>
        { filer.id }
      </td>
      <td>
        { filer.name }
        <br/>
        <span class="subdata">
          { filer.address_city }, { filer.address_state }
        </span>
      </td>
      <td>{ filer.ein }</td>
    </tr>
  )
}

export default function Filers() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const getData = async(page, limit) => {
    setIsLoading(true);
    const response = await axios.get(`/api/filers?page=${page}&limit=${limit}`);
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
      <h3>Filers</h3>
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
            <th>EIN</th>
          </thead>
          <tbody className='clickable'>
            { data.data.map((filer) => (
                <TableRow
                  filer={filer}
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
