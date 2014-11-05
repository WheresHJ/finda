define(function(require, exports, module) {
  'use strict';
  var flight = require('flight');
  var _ = require('lodash');
  var $ = require('jquery');
  var templates = require('infotemplates');

  module.exports = flight.component(function list() {
    this.defaultAttrs({
    });


    this.configureList = function(ev, config) {
      var listConfig = config.list;
      this.render = _.partial(templates.popup, listConfig);
    };

    this.loadData = function(ev, data) {
      var $ul = this.$node.empty().html('<ul></ul>').find('ul');
      var l = [];
      data.features.forEach(function(feature) {
        var $li = $("<li/>").html(this.render(feature.properties))
              .data('feature', feature);
        $li._text = $li.text();
        l.push($li);
      }.bind(this));
      l.sort(function(a, b) {
        a = a._text;
        b = b._text;
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      });
      $ul.html(l);
    };

    this.onFeatureSelected = function onFeatureSelected(ev) {
      var $li = $(ev.target).closest('li');
      var feature = $li.data('feature');
      this.trigger('selectFeature', feature);
    };

    this.after('initialize', function() {
      this.on(document, 'config', this.configureList);
      this.on(document, 'data', this.loadData);
      this.on(document, 'dataFiltered', this.loadData);
      this.on('click', this.onFeatureSelected);
    });
  });
});
