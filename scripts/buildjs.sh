#!/usr/bin/env bash

cd `dirname $BASH_SOURCE` && cd ../
node_modules/.bin/coffee --compile --output discussion_app/static/discussion/js `find discussion_app/static/discussion/coffee/ -maxdepth 1 -type f -name "*.coffee"`
node_modules/.bin/coffee --compile --output discussion_app/static/discussion/js/models `find discussion_app/static/discussion/coffee/models -maxdepth 1 -type f -name "*.coffee"`
node_modules/.bin/coffee --compile --output discussion_app/static/discussion/js/views `find discussion_app/static/discussion/coffee/views -maxdepth 1 -type f -name "*.coffee"`


JS_FILES=(
    # Vendor
    'discussion_app/static/discussion/js/vendor/split.js'
    'discussion_app/static/discussion/js/vendor/i18n.js'
    'discussion_app/static/discussion/js/vendor/URI.min.js'
    'discussion_app/static/discussion/js/vendor/jquery.leanModal.min.js'
    'discussion_app/static/discussion/js/vendor/jquery.timeago.js'
    'discussion_app/static/discussion/js/vendor/underscore-min.js'
    'discussion_app/static/discussion/js/vendor/backbone-min.js'
    'discussion_app/static/discussion/js/vendor/mustache.js'
    'discussion_app/static/discussion/js/vendor/Markdown.Converter.js'
    'discussion_app/static/discussion/js/vendor/Markdown.Sanitizer.js'
    'discussion_app/static/discussion/js/vendor/Markdown.Editor.js'
    'discussion_app/static/discussion/js/vendor/mathjax_delay_renderer.js'
    'discussion_app/static/discussion/js/vendor/customwmd.js'
    # Discussion
    'discussion_app/static/discussion/js/tooltip_manager.js'
    'discussion_app/static/discussion/js/models/discussion_user.js'
    'discussion_app/static/discussion/js/content.js'
    'discussion_app/static/discussion/js/discussion.js'
    'discussion_app/static/discussion/js/main.js'
    'discussion_app/static/discussion/js/discussion_filter.js'
    'discussion_app/static/discussion/js/views/discussion_content_view.js'
    'discussion_app/static/discussion/js/views/response_comment_view.js'
    'discussion_app/static/discussion/js/views/thread_response_show_view.js'
    'discussion_app/static/discussion/js/views/discussion_user_profile_view.js'
    'discussion_app/static/discussion/js/views/new_post_inline_vew.js'
    'discussion_app/static/discussion/js/views/thread_response_edit_view.js'
    'discussion_app/static/discussion/js/views/discussion_thread_view.js'
    'discussion_app/static/discussion/js/views/discussion_thread_view_inline.js'
    'discussion_app/static/discussion/js/views/thread_response_view.js'
    'discussion_app/static/discussion/js/views/discussion_thread_list_view.js'
    'discussion_app/static/discussion/js/views/discussion_thread_show_view.js'
    'discussion_app/static/discussion/js/views/discussion_thread_edit_view.js'
    'discussion_app/static/discussion/js/views/response_comment_show_view.js'
    'discussion_app/static/discussion/js/views/discussion_thread_profile_view.js'
    'discussion_app/static/discussion/js/views/new_post_view.js'
    'discussion_app/static/discussion/js/views/response_comment_edit_view.js'
    'discussion_app/static/discussion/js/discussion_router.js'
    'discussion_app/static/discussion/js/utils.js'
    'discussion_app/static/discussion/js/templates.js'
    'discussion_app/static/discussion/js/discussion_module_view.js'
  )

BUILD_DIR='discussion_app/static'

node_modules/.bin/uglifyjs ${JS_FILES[*]} > discussion_app/static/discussion-xblock.min.js
SHA=`shasum discussion_app/static/discussion-xblock.min.js`
mv discussion_app/static/discussion-xblock.min.js  discussion_app/static/discussion-xblock.${SHA:0:12}.min.js
