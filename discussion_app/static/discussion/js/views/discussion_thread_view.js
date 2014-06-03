// Generated by CoffeeScript 1.6.3
(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof Backbone !== "undefined" && Backbone !== null) {
    this.DiscussionThreadView = (function(_super) {
      var INITIAL_RESPONSE_PAGE_SIZE, SUBSEQUENT_RESPONSE_PAGE_SIZE;

      __extends(DiscussionThreadView, _super);

      function DiscussionThreadView() {
        this._delete = __bind(this._delete, this);
        this.cancelEdit = __bind(this.cancelEdit, this);
        this.update = __bind(this.update, this);
        this.edit = __bind(this.edit, this);
        this.endorseThread = __bind(this.endorseThread, this);
        this.addComment = __bind(this.addComment, this);
        this.renderResponse = __bind(this.renderResponse, this);
        this.renderResponseCountAndPagination = __bind(this.renderResponseCountAndPagination, this);
        _ref = DiscussionThreadView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      INITIAL_RESPONSE_PAGE_SIZE = 25;

      SUBSEQUENT_RESPONSE_PAGE_SIZE = 100;

      DiscussionThreadView.prototype.events = {
        "click .discussion-submit-post": "submitComment",
        "click .add-response-btn": "scrollToAddResponse"
      };

      DiscussionThreadView.prototype.$ = function(selector) {
        return this.$el.find(selector);
      };

      DiscussionThreadView.prototype.initialize = function() {
        DiscussionThreadView.__super__.initialize.call(this);
        this.createShowView();
        return this.responses = new Comments();
      };

      DiscussionThreadView.prototype.renderTemplate = function() {
        this.template = _.template($("#thread-template").html());
        return this.template(this.model.toJSON());
      };

      DiscussionThreadView.prototype.render = function() {
        var _this = this;
        this.$el.html(this.renderTemplate());
        this.initLocal();
        this.delegateEvents();
        this.renderShowView();
        this.renderAttrs();
        this.$("span.timeago").timeago();
        this.makeWmdEditor("reply-body");
        this.renderAddResponseButton();
        this.responses.on("add", this.renderResponse);
        setTimeout((function() {
          return _this.loadInitialResponses();
        }), 100);
        return this;
      };

      DiscussionThreadView.prototype.cleanup = function() {
        if (this.responsesRequest != null) {
          return this.responsesRequest.abort();
        }
      };

      DiscussionThreadView.prototype.loadResponses = function(responseLimit, elem, firstLoad) {
        var _this = this;
        return this.responsesRequest = DiscussionUtil.safeAjax({
          url: DiscussionUtil.urlFor('retrieve_single_thread', this.model.get('commentable_id'), this.model.id),
          data: {
            resp_skip: this.responses.size(),
            resp_limit: responseLimit ? responseLimit : void 0
          },
          $elem: elem,
          $loading: elem,
          takeFocus: true,
          complete: function() {
            return _this.responseRequest = null;
          },
          success: function(data, textStatus, xhr) {
            Content.loadContentInfos(data['annotated_content_info']);
            _this.responses.add(data['content']['children']);
            _this.renderResponseCountAndPagination(data['content']['resp_total']);
            return _this.trigger("thread:responses:rendered");
          },
          error: function(xhr) {
            if (xhr.status === 404) {
              return DiscussionUtil.discussionAlert(gettext("Sorry"), gettext("The thread you selected has been deleted. Please select another thread."));
            } else if (firstLoad) {
              return DiscussionUtil.discussionAlert(gettext("Sorry"), gettext("We had some trouble loading responses. Please reload the page."));
            } else {
              return DiscussionUtil.discussionAlert(gettext("Sorry"), gettext("We had some trouble loading more responses. Please try again."));
            }
          }
        });
      };

      DiscussionThreadView.prototype.loadInitialResponses = function() {
        return this.loadResponses(INITIAL_RESPONSE_PAGE_SIZE, this.$el.find(".responses"), true);
      };

      DiscussionThreadView.prototype.renderResponseCountAndPagination = function(responseTotal) {
        var buttonText, loadMoreButton, responseLimit, responsePagination, responsesRemaining, showingResponsesText,
          _this = this;
        this.$el.find(".response-count").html(interpolate(ngettext("%(numResponses)s response", "%(numResponses)s responses", responseTotal), {
          numResponses: responseTotal
        }, true));
        responsePagination = this.$el.find(".response-pagination");
        responsePagination.empty();
        if (responseTotal > 0) {
          responsesRemaining = responseTotal - this.responses.size();
          showingResponsesText = responsesRemaining === 0 ? gettext("Showing all responses") : interpolate(ngettext("Showing first response", "Showing first %(numResponses)s responses", this.responses.size()), {
            numResponses: this.responses.size()
          }, true);
          responsePagination.append($("<span>").addClass("response-display-count").html(_.escape(showingResponsesText)));
          if (responsesRemaining > 0) {
            if (responsesRemaining < SUBSEQUENT_RESPONSE_PAGE_SIZE) {
              responseLimit = null;
              buttonText = gettext("Load all responses");
            } else {
              responseLimit = SUBSEQUENT_RESPONSE_PAGE_SIZE;
              buttonText = interpolate(gettext("Load next %(numResponses)s responses"), {
                numResponses: responseLimit
              }, true);
            }
            loadMoreButton = $("<button>").addClass("load-response-button").html(_.escape(buttonText));
            loadMoreButton.click(function(event) {
              return _this.loadResponses(responseLimit, loadMoreButton);
            });
            return responsePagination.append(loadMoreButton);
          }
        }
      };

      DiscussionThreadView.prototype.renderResponse = function(response) {
        var view;
        response.set('thread', this.model);
        view = new ThreadResponseView({
          model: response
        });
        view.on("comment:add", this.addComment);
        view.on("comment:endorse", this.endorseThread);
        view.render();
        this.$el.find(".responses").append(view.el);
        return view.afterInsert();
      };

      DiscussionThreadView.prototype.renderAddResponseButton = function() {
        if (this.model.hasResponses() && this.model.can('can_reply')) {
          return this.$el.find('div.add-response').show();
        } else {
          return this.$el.find('div.add-response').hide();
        }
      };

      DiscussionThreadView.prototype.scrollToAddResponse = function(event) {
        var form;
        event.preventDefault();
        form = $(event.target).parents('article.discussion-article').find('form.discussion-reply-new');
        $('html, body').scrollTop(form.offset().top);
        return form.find('.wmd-panel textarea').focus();
      };

      DiscussionThreadView.prototype.addComment = function() {
        return this.model.comment();
      };

      DiscussionThreadView.prototype.endorseThread = function(endorsed) {
        var is_endorsed;
        is_endorsed = this.$el.find(".is-endorsed").length;
        return this.model.set('endorsed', is_endorsed);
      };

      DiscussionThreadView.prototype.submitComment = function(event) {
        var body, comment, url,
          _this = this;
        event.preventDefault();
        url = this.model.urlFor('reply');
        body = this.getWmdContent("reply-body");
        if (!body.trim().length) {
          return;
        }
        this.setWmdContent("reply-body", "");
        comment = new Comment({
          body: body,
          created_at: (new Date()).toISOString(),
          username: window.user.get("username"),
          votes: {
            up_count: 0
          },
          abuse_flaggers: [],
          endorsed: false,
          user_id: window.user.get("id")
        });
        comment.set('thread', this.model.get('thread'));
        this.renderResponse(comment);
        this.model.addComment();
        this.renderAddResponseButton();
        return DiscussionUtil.safeAjax({
          $elem: $(event.target),
          url: url,
          type: "POST",
          dataType: 'json',
          data: {
            body: body
          },
          success: function(data, textStatus) {
            comment.updateInfo(data.annotated_content_info);
            return comment.set(data.content);
          }
        });
      };

      DiscussionThreadView.prototype.edit = function(event) {
        this.createEditView();
        return this.renderEditView();
      };

      DiscussionThreadView.prototype.update = function(event) {
        var newBody, newTitle, url,
          _this = this;
        newTitle = this.editView.$(".edit-post-title").val();
        newBody = this.editView.$(".edit-post-body textarea").val();
        url = DiscussionUtil.urlFor('update_thread', this.model.id);
        return DiscussionUtil.safeAjax({
          $elem: $(event.target),
          $loading: event ? $(event.target) : void 0,
          url: url,
          type: "POST",
          dataType: 'json',
          async: false,
          data: {
            title: newTitle,
            body: newBody
          },
          error: DiscussionUtil.formErrorHandler(this.$(".edit-post-form-errors")),
          success: function(response, textStatus) {
            _this.editView.$(".edit-post-title").val("").attr("prev-text", "");
            _this.editView.$(".edit-post-body textarea").val("").attr("prev-text", "");
            _this.editView.$(".wmd-preview p").html("");
            _this.model.set({
              title: newTitle,
              body: newBody
            });
            _this.createShowView();
            return _this.renderShowView();
          }
        });
      };

      DiscussionThreadView.prototype.createEditView = function() {
        if (this.showView != null) {
          this.showView.undelegateEvents();
          this.showView.$el.empty();
          this.showView = null;
        }
        this.editView = new DiscussionThreadEditView({
          model: this.model
        });
        this.editView.bind("thread:update", this.update);
        return this.editView.bind("thread:cancel_edit", this.cancelEdit);
      };

      DiscussionThreadView.prototype.renderSubView = function(view) {
        view.setElement(this.$('.thread-content-wrapper'));
        view.render();
        return view.delegateEvents();
      };

      DiscussionThreadView.prototype.renderEditView = function() {
        return this.renderSubView(this.editView);
      };

      DiscussionThreadView.prototype.getShowViewClass = function() {
        return DiscussionThreadShowView;
      };

      DiscussionThreadView.prototype.createShowView = function() {
        var showViewClass;
        if (this.editView != null) {
          this.editView.undelegateEvents();
          this.editView.$el.empty();
          this.editView = null;
        }
        showViewClass = this.getShowViewClass();
        this.showView = new showViewClass({
          model: this.model
        });
        this.showView.bind("thread:_delete", this._delete);
        return this.showView.bind("thread:edit", this.edit);
      };

      DiscussionThreadView.prototype.renderShowView = function() {
        return this.renderSubView(this.showView);
      };

      DiscussionThreadView.prototype.cancelEdit = function(event) {
        event.preventDefault();
        this.createShowView();
        return this.renderShowView();
      };

      DiscussionThreadView.prototype._delete = function(event) {
        var $elem, url,
          _this = this;
        url = this.model.urlFor('_delete');
        if (!this.model.can('can_delete')) {
          return;
        }
        if (!confirm(gettext("Are you sure you want to delete this post?"))) {
          return;
        }
        this.model.remove();
        this.showView.undelegateEvents();
        this.undelegateEvents();
        this.$el.empty();
        $elem = $(event.target);
        return DiscussionUtil.safeAjax({
          $elem: $elem,
          url: url,
          type: "POST",
          success: function(response, textStatus) {}
        });
      };

      return DiscussionThreadView;

    })(DiscussionContentView);
  }

}).call(this);
