// Generated by CoffeeScript 1.6.1
(function() {

  describe('ThreadResponseView', function() {
    beforeEach(function() {
      setFixtures("<script id=\"thread-response-template\" type=\"text/template\">\n    <div/>\n</script>\n<div id=\"thread-response-fixture\"/>");
      this.response = new Comment({
        children: [{}, {}]
      });
      this.view = new ThreadResponseView({
        model: this.response,
        el: $("#thread-response-fixture")
      });
      spyOn(ThreadResponseShowView.prototype, "render");
      return spyOn(ResponseCommentView.prototype, "render");
    });
    describe('renderComments', function() {
      return it('populates commentViews and binds events', function() {
        this.view.createEditView();
        spyOn(this.view, 'cancelEdit');
        spyOn(this.view, 'cancelCommentEdits');
        spyOn(this.view, 'hideCommentForm');
        spyOn(this.view, 'showCommentForm');
        this.view.renderComments();
        expect(this.view.commentViews.length).toEqual(2);
        this.view.commentViews[0].trigger("comment:edit", jasmine.createSpyObj("event", ["preventDefault"]));
        expect(this.view.cancelEdit).toHaveBeenCalled();
        expect(this.view.cancelCommentEdits).toHaveBeenCalled();
        expect(this.view.hideCommentForm).toHaveBeenCalled();
        this.view.commentViews[0].trigger("comment:cancel_edit");
        return expect(this.view.showCommentForm).toHaveBeenCalled();
      });
    });
    return describe('cancelCommentEdits', function() {
      return it('calls cancelEdit on each comment view', function() {
        this.view.renderComments();
        expect(this.view.commentViews.length).toEqual(2);
        _.each(this.view.commentViews, function(commentView) {
          return spyOn(commentView, 'cancelEdit');
        });
        this.view.cancelCommentEdits();
        return _.each(this.view.commentViews, function(commentView) {
          return expect(commentView.cancelEdit).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);
