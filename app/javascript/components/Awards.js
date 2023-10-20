import React, { useEffect, useState } from 'react';

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

export default function Awards({ data }) {
  return (
    <>
      <h5>Awards ({ data.length })</h5>
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
