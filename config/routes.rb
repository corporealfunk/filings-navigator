Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # React app!
  root "home#index"

  namespace :api, :defaults => { :format => 'json' }  do
=begin
    resources :organizations, :only => [:index, :get] do
      resources :filings, :only => [:index, :get]
    end
=end

    resources :filings, :only => [:index, :show]
  end

  get '*path', to: "home#index", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
