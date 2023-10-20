class Api::FilingsController < ApplicationController
  def index
    # TODO: DRY this out where we have it
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

    pagination_data = Paginator.setup_relation_and_pagination_data(
      active_record_relation: Filing.all.sorted,
      page: page,
      limit: limit
    )

    @filings = pagination_data[:data]
    @pagination = pagination_data[:pagination]


    # TODO: this is JSON only, but we could get fancy
    # with format blocks, etc:
    # respond_to do |format|
    #   format.json
    #   format.xml
    # end
  end

  def show
    # avoid n+1 queries since we are sending down a lot in the view:
    @filing = Filing.includes(awards: :recipient).find(params[:id])
  end
end
