module.exports = (match) ->
  #match '', 'home#index'
  match 'public', 'home#index'

  #match 'index.html', 'home#index'
  match 'public/index.html', 'home#index'

  #match 'background.html', 'home#index'
  match 'public/background.html', 'home#index'

  #match 'popup.html', 'popup#index'
  match 'public/popup.html', 'popup-activity#show'

  match '#activity', 'popup-activity#show'
  match '#goals', 'popup-goals#show'
  match '#prescription', 'popup-prescription#show'
