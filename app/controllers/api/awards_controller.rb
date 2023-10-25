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

    # TODO: this might not be the best way to scope awards to entities
    # TODO: beware n+1 queries!
    if params[:filing_id]
      active_record_relation = Filing.find_by_id!(params[:filing_id])
      active_record_relation = active_record_relation.awards.includes(:recipient).order(order)
    elsif params[:recipient_id]
      active_record_relation = Organization.find_by_id!(params[:recipient_id])
      active_record_relation = active_record_relation.awards_received.joins(:filing).where('filings.is_canonical = ?', true).order(order)
    end

    pagination_data = Paginator.setup_relation_and_pagination_data(
      active_record_relation: active_record_relation,
      page: page,
      limit: limit
    )

    @awards = pagination_data[:data]
    @pagination = pagination_data[:pagination]
  end
end
