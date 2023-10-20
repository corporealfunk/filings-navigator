import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TableRow({ filingId, filer, taxPeriodEndDate, returnTimestamp, awardsCount }) {

  const filingPath = `/filings/${filingId}`;

  return (
    <tr key={ filingId }>
      <td>
        { filer.name }
        <br/>
        <span class="subdata">
          { filer.address_city }, { filer.address_state }
        </span>
      </td>
      <td>{ new Date(taxPeriodEndDate).toLocaleDateString() }</td>
      <td>{ new Date(returnTimestamp).toLocaleDateString() }</td>
      <td>
        { awardsCount > 0
          ? <Link to={ filingPath }>{ awardsCount }</Link>
          : '0'
        }
      </td>
    </tr>
  )
}

export default function Filings() {
  const [data, setData] = useState([]);

  const getData = async() => {
    const { data } = await axios.get('/api/filings');
    setData(data.data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h3>Filings</h3>
      <table class="u-full-width">
        <thead>
          <th>Filer</th>
          <th>Tax Year End</th>
          <th>Filing Date</th>
          <th># of Awards Given</th>
        </thead>
        <tbody>
          { data.map((filing) => (
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
    </>
  );
}
