module.exports = (match) ->
  match '', 'home#index'
  match 'index.html', 'home#index'
  match 'background.html', 'home#index'
  match 'popup.html', 'home#index'

  match 'public/popup.html', 'home#index'
