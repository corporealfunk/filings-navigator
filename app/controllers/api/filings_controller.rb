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
end
