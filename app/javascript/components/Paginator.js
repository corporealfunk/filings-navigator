import React, { useEffect, useState } from 'react';

export default function Paginator({
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  onNextPage,
  onPrevPage,
  onFirstPage,
  onLastPage,
  limit,
  onLimitChange
}) {
  return (
    <div className='row'>
      <div className='twelve columns text-center'>
        <p>
          { currentPage > 1 && (<a onClick={ onFirstPage }>&lt;&lt;</a>) }
          &nbsp;
          { currentPage > 1 && (<a onClick={ onPrevPage }>&lt;</a>) }
          &nbsp;
          Page { currentPage } of { totalPages }
          &nbsp;
          { currentPage < totalPages && (<a onClick={ onNextPage }>&gt;</a>) }
          &nbsp;
          { currentPage < totalPages && (<a onClick={ onLastPage }>&gt;&gt;</a>) }
          <br/>
          <input
            value={limit}
            onChange={onLimitChange}
            type="number"
            min="5"
            max="100"
          /> per page
        </p>
      </div>
    </div>
  );
}
