Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "home#index"

  namespace :api do
=begin
    resources :organizations, :only => [:index, :get] do
      resources :filings, :only => [:index, :get]
    end
=end

    resources :filings, :only => [:index, :get] do
      resources :awards, :only => [:index, :get]
    end
  end
end
