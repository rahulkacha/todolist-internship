(function ($) {
  "use strict";
  $(function () {
    $(".todo-list-add-btn").on("click", function (event) {});

    todoListItem.on("change", ".checkbox", function () {
      if ($(this).attr("checked")) {
        $(this).removeAttr("checked");
      } else {
        $(this).attr("checked", "checked");
      }

      $(this).closest("li").toggleClass("completed");
    });

    todoListItem.on("click", ".remove", function () {
      $(this).parent().remove();
    });
  });
})(jQuery);
