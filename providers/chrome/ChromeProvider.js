define([
  "underscore",
  "backbone",
  "providers/Provider",
  "providers/ProviderEntry",
  "providers/aggregate/AggregateProvider",
  chrome.extension.getURL("/providers") + "/google/SearchProvider.js",
  chrome.extension.getURL("/providers") + "/chrome/ChromeWrapper.js",
  chrome.extension.getURL("/providers") + "/chrome/bookmarks/BookmarksProvider.js",
  chrome.extension.getURL("/providers") + "/chrome/history/HistoryProvider.js",
  chrome.extension.getURL("/providers") + "/chrome/topsites/TopSitesProvider.js",
  chrome.extension.getURL("/providers") + "/chrome/downloads/DownloadsProvider.js"
], function(
  _,
  Backbone,
  Provider,
  ProviderEntry,
  AggregateProvider,
  SearchProvider,
  ChromeWrapper,
  BookmarksProvider,
  HistoryProvider,
  TopSitesProvider,
  DownloadsProvider
) {

  return Provider.extend({

    initialize: function() {
      var wrapper= new ChromeWrapper();
      this._chromeProviders= [
          new BookmarksProvider({}, { wrapper: wrapper }),
          new HistoryProvider(wrapper),
          new TopSitesProvider(wrapper),
          new DownloadsProvider(wrapper)
      ];

      this._aggregateProvider= new AggregateProvider().add(this._chromeProviders);
    },

    icon: function() {
      return "";
    },

    accepts: function() {
      return true;
    },

    retrieve: function(filter) {
      return filter ?
                this._aggregateProvider
                        .defaultEntry(SearchProvider.entry(filter))
                        .retrieve(filter) :
                $.Deferred().resolve(new Backbone.Collection(this._chromeProviders));
    }
  });
});
