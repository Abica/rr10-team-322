$(function() {
    $('tr td:last-child, tr th:last-child').addClass('last');
    
    dragOptions = {
        revert: 'invalid',
    };
    $('.card').live('mouseover', function() {
        $(this).draggable(dragOptions);
    });
    $('.cardwall td').droppable({
        drop: function(event, ui) {
            var el = $(ui.draggable).clone();
            $(this).html(el);
            el.removeClass('ui-draggable-dragging')
              .removeClass('ui-draggable')
              .css('top', 0)
              .css('left', 0)
              .css('position', 'static')
              .draggable(dragOptions);
            $(ui.draggable).remove();
        }
    });
});
