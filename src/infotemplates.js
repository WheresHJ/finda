define(function(require, exports) {
    'use strict';
    var Handlebars = require('handlebars'),
     _ = require('lodash'),
     templates = {
      url: Handlebars.compile('<a href="{{url}}">{{title}}</a>'),
      image: Handlebars.compile('<img src="{{url}}"/>'),
      title: Handlebars.compile('<div><h4>{{title}}</h4><div>{{{rendered}}}</div></div>'),
      list: Handlebars.compile('<ul> {{#list}} <li>{{{this}}}</li> {{/list}} </ul>'),
      simple: Handlebars.compile('{{text}}'),
      popup: Handlebars.compile('<div>{{#popup}}<div id="{{div_id}}">{{{rendered}}}</div>{{/popup}}</div>')
    },
        formatters = {
          url: function(value, property) {
            var title = property.title || '[link]';
            return templates.url({title: title,
                                  url: value});
          },

          image: function(value) {
            return templates.image({url: value});
          },

          title: function(value, property) {
            return templates.title({title: property.title,
                                    rendered: format(value)});
          },

          list: function(value, property) {
            if (value.length === 0) {
              return '';
            } else if (value.length === 1) {
              return formatters.simple(value[0], property);
            }
            return templates.list({
              list: _.map(value, formatters.simple)
            });
          },

          simple: function(value) {
            return templates.simple({text: value}).replace(
                /\n/g, '<br>');
          }
        };

        function format(value, property) {
          property = property || {};
          var formatter;
          if (property.url) {
            formatter = 'url';
          } else if (property.image) {
            formatter = 'image';
          } else if (property.title) {
            formatter = 'title';
          } else if (_.isArray(value)) {
            formatter = 'list';
          } else {
            formatter = 'simple';
          }
          // apply the discovered formatter to the data
          return formatters[formatter](value, property);
        }

      exports.popup = function(properties, feature) {
        var popup = [],
            rendered;
        _.each(properties, function(property, key) {
          var value = feature[key];
          if (value !== undefined && (value.length === undefined || value.length !== 0)) {
            rendered = format(value, property);
            if (rendered) {
              popup.push({
                div_id: key,
                rendered: rendered
              });
            }
          }
        });
        return templates.popup({popup: popup});
      };
  });
