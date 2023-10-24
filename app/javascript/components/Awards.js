import React, { useEffect, useState } from 'react';

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

export default function Awards({ data, pagination }) {
  return (
    <>
      <h5>Awards ({ pagination.total_records })</h5>
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
    </>
  );
}
