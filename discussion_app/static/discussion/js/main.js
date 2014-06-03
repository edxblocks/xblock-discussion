// Generated by CoffeeScript 1.6.3
(function() {
  var DiscussionApp, DiscussionProfileApp;

  if (typeof Backbone !== "undefined" && Backbone !== null) {
    DiscussionApp = {
      start: function(elem) {
        var content_info, discussion, element, thread_pages, threads, user_info;
        DiscussionUtil.loadRolesFromContainer();
        element = $(elem);
        window.$$course_id = element.data("course-id");
        user_info = element.data("user-info");
        threads = element.data("threads");
        thread_pages = element.data("thread-pages");
        content_info = element.data("content-info");
        window.user = new DiscussionUser(user_info);
        Content.loadContentInfos(content_info);
        discussion = new Discussion(threads, {
          pages: thread_pages
        });
        new DiscussionRouter({
          discussion: discussion
        });
        return Backbone.history.start({
          pushState: true,
          root: "/courses/" + $$course_id + "/discussion/forum/"
        });
      }
    };
    DiscussionProfileApp = {
      start: function(elem) {
        var element, numPages, page, threads, user_info;
        element = $(elem);
        window.$$course_id = element.data("course-id");
        threads = element.data("threads");
        user_info = element.data("user-info");
        window.user = new DiscussionUser(user_info);
        page = element.data("page");
        numPages = element.data("num-pages");
        return new DiscussionUserProfileView({
          el: element,
          collection: threads,
          page: page,
          numPages: numPages
        });
      }
    };
    $(function() {
      $("section.discussion").each(function(index, elem) {
        return DiscussionApp.start(elem);
      });
      return $("section.discussion-user-threads").each(function(index, elem) {
        return DiscussionProfileApp.start(elem);
      });
    });
  }

}).call(this);
