class Api::AwardsController < ApplicationController
  def index
    # TODO: DRY this out where we have it... could be
    page = (params[:page] || 1).to_i
    limit = (params[:limit] || 0).to_i
    order = (params[:order] || 'id').to_sym

    # sanity check
    page = 1 if page < 1

    # if limit is invalid, default to no pagination:
    if limit < 1
      limit = 0
      page = 1
    end

    filing = Filing.find_by_id!(params[:filing_id])

    pagination_data = Paginator.setup_relation_and_pagination_data(
      active_record_relation: filing.awards.includes(:recipient).order(order),
      page: page,
      limit: limit
    )

    @awards = pagination_data[:data]
    @pagination = pagination_data[:pagination]
  end
end
