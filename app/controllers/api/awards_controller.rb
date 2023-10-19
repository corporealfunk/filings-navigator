class Api::AwardsController < ApplicationController
  def index
    filing = Filing.find_by_id!(params[:filing_id])

    @awards = filing.awards
  end
end
