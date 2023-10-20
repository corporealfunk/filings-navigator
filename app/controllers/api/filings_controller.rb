class Api::FilingsController < ApplicationController
  def index
    @filings = Filing.all.sorted

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
