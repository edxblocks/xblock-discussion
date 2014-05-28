// Generated by CoffeeScript 1.6.3
(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof Backbone !== "undefined" && Backbone !== null) {
    this.DiscussionThreadListView = (function(_super) {
      __extends(DiscussionThreadListView, _super);

      function DiscussionThreadListView() {
        this.updateEmailNotifications = __bind(this.updateEmailNotifications, this);
        this.retrieveFollowed = __bind(this.retrieveFollowed, this);
        this.toggleTopicDrop = __bind(this.toggleTopicDrop, this);
        this.threadRemoved = __bind(this.threadRemoved, this);
        this.threadSelected = __bind(this.threadSelected, this);
        this.renderThreadListItem = __bind(this.renderThreadListItem, this);
        this.renderThread = __bind(this.renderThread, this);
        this.renderThreads = __bind(this.renderThreads, this);
        this.updateSidebar = __bind(this.updateSidebar, this);
        this.addAndSelectThread = __bind(this.addAndSelectThread, this);
        this.reloadDisplayedCollection = __bind(this.reloadDisplayedCollection, this);
        _ref = DiscussionThreadListView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DiscussionThreadListView.prototype.events = {
        "click .search": "showSearch",
        "click .home": "goHome",
        "click .browse": "toggleTopicDrop",
        "keydown .post-search-field": "performSearch",
        "focus .post-search-field": "showSearch",
        "click .sort-bar a": "sortThreads",
        "click .browse-topic-drop-menu": "filterTopic",
        "click .browse-topic-drop-search-input": "ignoreClick",
        "click .post-list .list-item a": "threadSelected",
        "click .post-list .more-pages a": "loadMorePages",
        "change .cohort-options": "chooseCohort",
        'keyup .browse-topic-drop-search-input': DiscussionFilter.filterDrop
      };

      DiscussionThreadListView.prototype.initialize = function() {
        var _this = this;
        this.displayedCollection = new Discussion(this.collection.models, {
          pages: this.collection.pages
        });
        this.collection.on("change", this.reloadDisplayedCollection);
        this.sortBy = "date";
        this.discussionIds = "";
        this.collection.on("reset", function(discussion) {
          var board;
          board = $(".current-board").html();
          _this.displayedCollection.current_page = discussion.current_page;
          _this.displayedCollection.pages = discussion.pages;
          return _this.displayedCollection.reset(discussion.models);
        });
        this.collection.on("add", this.addAndSelectThread);
        this.sidebar_padding = 10;
        this.sidebar_header_height = 87;
        this.boardName;
        this.template = _.template($("#thread-list-template").html());
        this.current_search = "";
        return this.mode = 'all';
      };

      DiscussionThreadListView.prototype.reloadDisplayedCollection = function(thread) {
        var active, content, current_el, thread_id;
        thread_id = thread.get('id');
        content = this.renderThread(thread);
        current_el = this.$("a[data-id=" + thread_id + "]");
        active = current_el.hasClass("active");
        current_el.replaceWith(content);
        if (active) {
          return this.setActiveThread(thread_id);
        }
      };

      DiscussionThreadListView.prototype.addAndSelectThread = function(thread) {
        var commentable, commentable_id,
          _this = this;
        commentable_id = thread.get("commentable_id");
        commentable = this.$(".board-name[data-discussion_id]").filter(function() {
          return $(this).data("discussion_id").id === commentable_id;
        });
        this.setTopicHack(commentable);
        return this.retrieveDiscussion(commentable_id, function() {
          return _this.trigger("thread:created", thread.get('id'));
        });
      };

      DiscussionThreadListView.prototype.updateSidebar = function() {
        var amount, discussionBody, discussionBottomOffset, discussionsBodyBottom, discussionsBodyTop, postListWrapper, scrollTop, sidebar, sidebarHeight, sidebarWidth, topOffset, windowHeight;
        scrollTop = $(window).scrollTop();
        windowHeight = $(window).height();
        discussionBody = $(".discussion-article");
        discussionsBodyTop = discussionBody[0] ? discussionBody.offset().top : void 0;
        discussionsBodyBottom = discussionsBodyTop + discussionBody.outerHeight();
        sidebar = $(".sidebar");
        if (scrollTop > discussionsBodyTop - this.sidebar_padding) {
          sidebar.css('top', scrollTop - discussionsBodyTop + this.sidebar_padding);
        } else {
          sidebar.css('top', '0');
        }
        sidebarWidth = .31 * $(".discussion-body").width();
        sidebar.css('width', sidebarWidth + 'px');
        sidebarHeight = windowHeight - Math.max(discussionsBodyTop - scrollTop, this.sidebar_padding);
        topOffset = scrollTop + windowHeight;
        discussionBottomOffset = discussionsBodyBottom + this.sidebar_padding;
        amount = Math.max(topOffset - discussionBottomOffset, 0);
        sidebarHeight = sidebarHeight - this.sidebar_padding - amount;
        sidebarHeight = Math.min(sidebarHeight + 1, discussionBody.outerHeight());
        sidebar.css('height', sidebarHeight);
        postListWrapper = this.$('.post-list-wrapper');
        return postListWrapper.css('height', (sidebarHeight - this.sidebar_header_height - 4) + 'px');
      };

      DiscussionThreadListView.prototype.ignoreClick = function(event) {
        return event.stopPropagation();
      };

      DiscussionThreadListView.prototype.render = function() {
        this.timer = 0;
        this.$el.html(this.template());
        $(window).bind("load", this.updateSidebar);
        $(window).bind("scroll", this.updateSidebar);
        $(window).bind("resize", this.updateSidebar);
        this.displayedCollection.on("reset", this.renderThreads);
        this.displayedCollection.on("thread:remove", this.renderThreads);
        this.renderThreads();
        return this;
      };

      DiscussionThreadListView.prototype.renderThreads = function() {
        var content, rendered, thread, _i, _len, _ref1;
        this.$(".post-list").html("");
        rendered = $("<div></div>");
        _ref1 = this.displayedCollection.models;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          thread = _ref1[_i];
          content = this.renderThread(thread);
          rendered.append(content);
          content.wrap("<li class='list-item' data-id='\"" + (thread.get('id')) + "\"' />");
        }
        this.$(".post-list").html(rendered.html());
        this.renderMorePages();
        this.updateSidebar();
        return this.trigger("threads:rendered");
      };

      DiscussionThreadListView.prototype.renderMorePages = function() {
        if (this.displayedCollection.hasMorePages()) {
          return this.$(".post-list").append("<li class='more-pages'><a href='#'>" + gettext("Load more") + "</a></li>");
        }
      };

      DiscussionThreadListView.prototype.loadMorePages = function(event) {
        var error, lastThread, loadingDiv, options, _ref1,
          _this = this;
        if (event) {
          event.preventDefault();
        }
        this.$(".more-pages").html('<div class="loading-animation" tabindex=0><span class="sr" role="alert">' + gettext('Loading more threads') + '</span></div>');
        this.$(".more-pages").addClass("loading");
        loadingDiv = this.$(".more-pages .loading-animation");
        DiscussionUtil.makeFocusTrap(loadingDiv);
        loadingDiv.focus();
        options = {};
        switch (this.mode) {
          case 'search':
            options.search_text = this.current_search;
            if (this.group_id) {
              options.group_id = this.group_id;
            }
            break;
          case 'followed':
            options.user_id = window.user.id;
            options.group_id = "all";
            break;
          case 'commentables':
            options.commentable_ids = this.discussionIds;
            if (this.group_id) {
              options.group_id = this.group_id;
            }
            break;
          case 'all':
            if (this.group_id) {
              options.group_id = this.group_id;
            }
        }
        lastThread = (_ref1 = this.collection.last()) != null ? _ref1.get('id') : void 0;
        if (lastThread) {
          this.once("threads:rendered", function() {
            return $(".post-list li:has(a[data-id='" + lastThread + "']) + li a").focus();
          });
        } else {
          this.once("threads:rendered", function() {
            var _ref2;
            return (_ref2 = $(".post-list a").first()) != null ? _ref2.focus() : void 0;
          });
        }
        error = function() {
          _this.renderThreads();
          return DiscussionUtil.discussionAlert(gettext("Sorry"), gettext("We had some trouble loading more threads. Please try again."));
        };
        return this.collection.retrieveAnotherPage(this.mode, options, {
          sort_key: this.sortBy
        }, error);
      };

      DiscussionThreadListView.prototype.renderThread = function(thread) {
        var content, unreadCount;
        content = $(_.template($("#thread-list-item-template").html())(thread.toJSON()));
        if (thread.get('subscribed')) {
          content.addClass("followed");
        }
        if (thread.get('endorsed')) {
          content.addClass("resolved");
        }
        if (thread.get('read')) {
          content.addClass("read");
        }
        unreadCount = thread.get('unread_comments_count');
        if (unreadCount > 0) {
          content.find('.comments-count').addClass("unread").attr("data-tooltip", interpolate(ngettext('%(unread_count)s new comment', '%(unread_count)s new comments', unreadCount), {
            unread_count: thread.get('unread_comments_count')
          }, true));
        }
        return this.highlight(content);
      };

      DiscussionThreadListView.prototype.highlight = function(el) {
        return el.html(el.html().replace(/&lt;mark&gt;/g, "<mark>").replace(/&lt;\/mark&gt;/g, "</mark>"));
      };

      DiscussionThreadListView.prototype.renderThreadListItem = function(thread) {
        var view;
        view = new ThreadListItemView({
          model: thread
        });
        view.on("thread:selected", this.threadSelected);
        view.on("thread:removed", this.threadRemoved);
        view.render();
        return this.$(".post-list").append(view.el);
      };

      DiscussionThreadListView.prototype.threadSelected = function(e) {
        var thread_id;
        thread_id = $(e.target).closest("a").attr("data-id");
        this.setActiveThread(thread_id);
        this.trigger("thread:selected", thread_id);
        return false;
      };

      DiscussionThreadListView.prototype.threadRemoved = function(thread_id) {
        return this.trigger("thread:removed", thread_id);
      };

      DiscussionThreadListView.prototype.setActiveThread = function(thread_id) {
        this.$(".post-list a[data-id!='" + thread_id + "']").removeClass("active");
        return this.$(".post-list a[data-id='" + thread_id + "']").addClass("active");
      };

      DiscussionThreadListView.prototype.showSearch = function() {
        this.$(".browse").removeClass('is-dropped');
        this.hideTopicDrop();
        this.$(".search").addClass('is-open');
        this.$(".browse").removeClass('is-open');
        if (!this.$(".post-search-field").is(":focus")) {
          return setTimeout((function() {
            return this.$(".post-search-field").focus();
          }), 200);
        }
      };

      DiscussionThreadListView.prototype.goHome = function() {
        var thread_id, url,
          _this = this;
        this.template = _.template($("#discussion-home").html());
        $(".discussion-column").html(this.template);
        $(".post-list a").removeClass("active");
        $("input.email-setting").bind("click", this.updateEmailNotifications);
        url = DiscussionUtil.urlFor("notifications_status", window.user.get("id"));
        DiscussionUtil.safeAjax({
          url: url,
          type: "GET",
          success: function(response, textStatus) {
            if (response.status) {
              return $('input.email-setting').attr('checked', 'checked');
            } else {
              return $('input.email-setting').removeAttr('checked');
            }
          }
        });
        thread_id = null;
        return this.trigger("thread:removed");
      };

      DiscussionThreadListView.prototype.toggleTopicDrop = function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.current_search !== "") {
          this.clearSearch();
        }
        this.$(".search").removeClass('is-open');
        this.$(".browse").addClass('is-open');
        this.$(".browse").toggleClass('is-dropped');
        if (this.$(".browse").hasClass('is-dropped')) {
          this.$(".browse-topic-drop-menu-wrapper").show();
          $(".browse-topic-drop-search-input").focus();
          $("body").bind("click", this.toggleTopicDrop);
          return $("body").bind("keydown", this.setActiveItem);
        } else {
          return this.hideTopicDrop();
        }
      };

      DiscussionThreadListView.prototype.hideTopicDrop = function() {
        this.$(".browse-topic-drop-menu-wrapper").hide();
        $("body").unbind("click", this.toggleTopicDrop);
        return $("body").unbind("keydown", this.setActiveItem);
      };

      DiscussionThreadListView.prototype.setTopicHack = function(boardNameContainer) {
        var boardName, item;
        item = $(boardNameContainer).closest('a');
        boardName = item.find(".board-name").html();
        _.each(item.parents('ul').not('.browse-topic-drop-menu'), function(parent) {
          return boardName = $(parent).siblings('a').find('.board-name').html() + ' / ' + boardName;
        });
        return this.$(".current-board").html(this.fitName(boardName));
      };

      DiscussionThreadListView.prototype.setTopic = function(event) {
        var boardName, item;
        item = $(event.target).closest('a');
        boardName = item.find(".board-name").html();
        _.each(item.parents('ul').not('.browse-topic-drop-menu'), function(parent) {
          return boardName = $(parent).siblings('a').find('.board-name').html() + ' / ' + boardName;
        });
        return this.$(".current-board").html(this.fitName(boardName));
      };

      DiscussionThreadListView.prototype.setSelectedTopic = function(name) {
        return this.$(".current-board").html(this.fitName(name));
      };

      DiscussionThreadListView.prototype.getNameWidth = function(name) {
        var test, width;
        test = $("<div>");
        test.css({
          "font-size": this.$(".current-board").css('font-size'),
          opacity: 0,
          position: 'absolute',
          left: -1000,
          top: -1000
        });
        $("body").append(test);
        test.html(name);
        width = test.width();
        test.remove();
        return width;
      };

      DiscussionThreadListView.prototype.fitName = function(name) {
        var partialName, path, rawName, width, x;
        this.maxNameWidth = (this.$el.width() * .8) - 50;
        width = this.getNameWidth(name);
        if (width < this.maxNameWidth) {
          return name;
        }
        path = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = name.split("/");
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            x = _ref1[_i];
            _results.push(x.replace(/^\s+|\s+$/g, ""));
          }
          return _results;
        })();
        while (path.length > 1) {
          path.shift();
          partialName = gettext("…") + "/" + path.join("/");
          if (this.getNameWidth(partialName) < this.maxNameWidth) {
            return partialName;
          }
        }
        rawName = path[0];
        name = gettext("…") + "/" + rawName;
        while (this.getNameWidth(name) > this.maxNameWidth) {
          rawName = rawName.slice(0, rawName.length - 1);
          name = gettext("…") + "/" + rawName + gettext("…");
        }
        return name;
      };

      DiscussionThreadListView.prototype.filterTopic = function(event) {
        var discussionId, discussionIds, item;
        if (this.current_search !== "") {
          this.setTopic(event);
          return this.clearSearch(this.filterTopic, event);
        } else {
          this.setTopic(event);
          item = $(event.target).closest('li');
          discussionId = item.find("span.board-name").data("discussion_id");
          if (discussionId === "#all") {
            this.discussionIds = "";
            this.$(".post-search-field").val("");
            this.$('.cohort').show();
            return this.retrieveAllThreads();
          } else if (discussionId === "#flagged") {
            this.discussionIds = "";
            this.$(".post-search-field").val("");
            this.$('.cohort').hide();
            return this.retrieveFlaggedThreads();
          } else if (discussionId === "#following") {
            this.retrieveFollowed(event);
            return this.$('.cohort').hide();
          } else {
            discussionIds = _.map(item.find(".board-name[data-discussion_id]"), function(board) {
              return $(board).data("discussion_id").id;
            });
            if ($(event.target).attr('cohorted') === "True") {
              return this.retrieveDiscussions(discussionIds, "function(){$('.cohort').show();}");
            } else {
              return this.retrieveDiscussions(discussionIds, "function(){$('.cohort').hide();}");
            }
          }
        }
      };

      DiscussionThreadListView.prototype.chooseCohort = function(event) {
        this.group_id = this.$('.cohort-options :selected').val();
        this.collection.current_page = 0;
        this.collection.reset();
        return this.loadMorePages(event);
      };

      DiscussionThreadListView.prototype.retrieveDiscussion = function(discussion_id, callback) {
        var url,
          _this = this;
        if (callback == null) {
          callback = null;
        }
        url = DiscussionUtil.urlFor("retrieve_discussion", discussion_id);
        return DiscussionUtil.safeAjax({
          url: url,
          type: "GET",
          success: function(response, textStatus) {
            _this.collection.current_page = response.page;
            _this.collection.pages = response.num_pages;
            _this.collection.reset(response.discussion_data);
            Content.loadContentInfos(response.annotated_content_info);
            _this.displayedCollection.reset(_this.collection.models);
            if (callback != null) {
              return callback();
            }
          }
        });
      };

      DiscussionThreadListView.prototype.retrieveDiscussions = function(discussion_ids) {
        this.discussionIds = discussion_ids.join(',');
        this.mode = 'commentables';
        return this.retrieveFirstPage();
      };

      DiscussionThreadListView.prototype.retrieveAllThreads = function() {
        this.mode = 'all';
        return this.retrieveFirstPage();
      };

      DiscussionThreadListView.prototype.retrieveFirstPage = function(event) {
        this.collection.current_page = 0;
        this.collection.reset();
        return this.loadMorePages(event);
      };

      DiscussionThreadListView.prototype.retrieveFlaggedThreads = function(event) {
        this.collection.current_page = 0;
        this.collection.reset();
        this.mode = 'flagged';
        return this.loadMorePages(event);
      };

      DiscussionThreadListView.prototype.sortThreads = function(event) {
        var activeSort, newSort;
        activeSort = this.$(".sort-bar a[class='active']");
        activeSort.removeClass("active");
        activeSort.attr("aria-checked", "false");
        newSort = $(event.target);
        newSort.addClass("active");
        newSort.attr("aria-checked", "true");
        this.sortBy = newSort.data("sort");
        this.displayedCollection.comparator = (function() {
          switch (this.sortBy) {
            case 'date':
              return this.displayedCollection.sortByDateRecentFirst;
            case 'votes':
              return this.displayedCollection.sortByVotes;
            case 'comments':
              return this.displayedCollection.sortByComments;
          }
        }).call(this);
        return this.retrieveFirstPage(event);
      };

      DiscussionThreadListView.prototype.performSearch = function(event) {
        var text;
        if (event.which === 13) {
          event.preventDefault();
          text = this.$(".post-search-field").val();
          return this.searchFor(text);
        }
      };

      DiscussionThreadListView.prototype.searchFor = function(text, callback, value) {
        var url,
          _this = this;
        this.mode = 'search';
        this.current_search = text;
        url = DiscussionUtil.urlFor("search");
        return DiscussionUtil.safeAjax({
          $elem: this.$(".post-search-field"),
          data: {
            text: text
          },
          url: url,
          type: "GET",
          $loading: $,
          loadingCallback: function() {
            return _this.$(".post-list").html('<li class="loading"><div class="loading-animation"><span class="sr">' + gettext('Loading thread list') + '</span></div></li>');
          },
          loadedCallback: function() {
            if (callback) {
              return callback.apply(_this, [value]);
            }
          },
          success: function(response, textStatus) {
            if (textStatus === 'success') {
              _this.collection.reset(response.discussion_data);
              Content.loadContentInfos(response.annotated_content_info);
              _this.collection.current_page = response.page;
              _this.collection.pages = response.num_pages;
              return _this.displayedCollection.reset(_this.collection.models);
            }
          }
        });
      };

      DiscussionThreadListView.prototype.clearSearch = function(callback, value) {
        this.$(".post-search-field").val("");
        return this.searchFor("", callback, value);
      };

      DiscussionThreadListView.prototype.setActiveItem = function(event) {
        var index, itemFromTop, itemTop, items, scrollTarget, scrollTop;
        if (event.which === 13) {
          $(".browse-topic-drop-menu-wrapper .focused").click();
          return;
        }
        if (event.which !== 40 && event.which !== 38) {
          return;
        }
        event.preventDefault();
        items = $.makeArray($(".browse-topic-drop-menu-wrapper a").not(".hidden"));
        index = items.indexOf($('.browse-topic-drop-menu-wrapper .focused')[0]);
        if (event.which === 40) {
          index = Math.min(index + 1, items.length - 1);
        }
        if (event.which === 38) {
          index = Math.max(index - 1, 0);
        }
        $(".browse-topic-drop-menu-wrapper .focused").removeClass("focused");
        $(items[index]).addClass("focused");
        itemTop = $(items[index]).parent().offset().top;
        scrollTop = $(".browse-topic-drop-menu").scrollTop();
        itemFromTop = $(".browse-topic-drop-menu").offset().top - itemTop;
        scrollTarget = Math.min(scrollTop - itemFromTop, scrollTop);
        scrollTarget = Math.max(scrollTop - itemFromTop - $(".browse-topic-drop-menu").height() + $(items[index]).height(), scrollTarget);
        return $(".browse-topic-drop-menu").scrollTop(scrollTarget);
      };

      DiscussionThreadListView.prototype.retrieveFollowed = function(event) {
        this.mode = 'followed';
        return this.retrieveFirstPage(event);
      };

      DiscussionThreadListView.prototype.updateEmailNotifications = function() {
        var _this = this;
        if ($('input.email-setting').attr('checked')) {
          return DiscussionUtil.safeAjax({
            url: DiscussionUtil.urlFor("enable_notifications"),
            type: "POST",
            error: function() {
              return $('input.email-setting').removeAttr('checked');
            }
          });
        } else {
          return DiscussionUtil.safeAjax({
            url: DiscussionUtil.urlFor("disable_notifications"),
            type: "POST",
            error: function() {
              return $('input.email-setting').attr('checked', 'checked');
            }
          });
        }
      };

      return DiscussionThreadListView;

    })(Backbone.View);
  }

}).call(this);
