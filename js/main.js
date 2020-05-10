$(document).ready(function () {
  var url = 'https://my-json-server.typicode.com/baimibrohim/pwa/products'
  var dataResult = ''
  var catresult = ''
  var categories = []

  function renderPage(data){
      $.each(data, function (key, items) {
        _cat = items.catogory
        dataResult += '<div>'
          + '<h3>' + items.name + '</h3>'
          + '<p>' + _cat + '</p>'
        '</div>';
        if ($.inArray(_cat, categories) == -1) {
          categories.push(_cat)
          catresult += '<option value="' + _cat + '">' + _cat + '</option>'
        }
      })
      $('#products').html(dataResult)
      $('#cat_select').html('<option value="all">All</option>' + catresult)
  }

  var networkDataReceived = false
  // fresh data from online
  var networkUpdate = fetch(url).then(function(response){
    return response.json()
  }).then(function(data){
    networkDataReceived = true
    renderPage(data)
  })

  // return data from caches 
  caches.match(url).then(function(response){
    if(!response) throw Error('no data on cache')
    return response.json()
  }).then(function(data){
    if(!networkDataReceived){
      renderPage(data)
      console.log('rendaer data from cache')
    }
  }).catch(function(){
    return networkUpdate
  })

  $('#cat_select').on('change', function () {
    updateProduct($(this).val())
  })

  function updateProduct(cat) {
    var dataResult = ''
    var _newUrl = url
    if (cat != "all")
      _newUrl = url + '?catogory=' + cat
    
    $.get(_newUrl, function (data) {
      $.each(data, function (key, items) {
        _cat = items.catogory
        dataResult += '<div>'
          + '<h3>' + items.name + '</h3>'
          + '<p>' + _cat + '</p>'
        '</div>';
      })
      $('#products').html(dataResult)
    })
  }

})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}