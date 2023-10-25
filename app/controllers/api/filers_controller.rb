class Api::FilersController < ApplicationController
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
      active_record_relation: Organization.filers.sorted,
      page: page,
      limit: limit
    )

    @filers = pagination_data[:data]
    @pagination = pagination_data[:pagination]


    # TODO: this is JSON only, but we could get fancy
    # with format blocks, etc:
    # respond_to do |format|
    #   format.json
    #   format.xml
    # end
  end

  def show
    @filer = Organization.find(params[:id])
  end
end
