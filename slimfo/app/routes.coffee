module.exports = (match) ->
  match '', 'home#index'
  match 'public', 'home#index'
  
  match 'index.html', 'home#index'
  match 'public/index.html', 'home#index'
  
  match 'background.html', 'home#index'
  match 'public/background.html', 'home#index'
  
  match 'popup.html', 'popup#index'
  match 'public/popup.html', 'popup#index'
