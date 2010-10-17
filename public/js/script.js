$(function() {
    $('tr td:last-child, tr th:last-child').addClass('last');
     
    dragOptions = {
        revert: 'invalid',
    };
    $('.card').live('mouseover', function() {
        $(this).draggable(dragOptions);
    });
    $('.cardwall td, .backlog-box').droppable({
        drop: function(event, ui) {
            var el = $(ui.draggable).clone();
            $(this).append(el);
            el.removeClass('ui-draggable-dragging')
              .removeClass('ui-draggable')
              .css('top', 0)
              .css('left', 0)
              .css('position', 'static')
              .draggable(dragOptions);
            $(ui.draggable).remove();
        }
    });

    $('.lane-title').live('click', function() {
        var el = $('<input/>').attr('type', 'text')
                     .addClass('lane-title-edit')
                     .val($(this).html())
        $(this).replaceWith(el);
        el.focus();
    });
    $('.lane-title-edit').live('blur', function() {
        // TODO: ajax
        $(this).replaceWith(
            $('<div/>').addClass('lane-title').html($(this).val())
        );
    });
    /** Backlog management */
    $('#backlog .add').live('click', function() {
        $.fancybox($('.card-new'));
    });
    $('.card-new .cancel').click($.fancybox.close);
    $('.card-new .save').click(function() {
        // TODO: ajax
        var el = $("<div/>").addClass("card")
                            .html($('.card-new .description').val());
        $('#backlog .backlog-box').append(el);
        $.fancybox.close();
    });
    /** end backlog */
 
    $('.card').live('click', function() {
        var el = $(this);
        $.fancybox($('.card-detail'));
        $('.card-detail .description').val(el.html());
        $('.card-detail .save').click(function() {
            // TODO: ajax
            el.html($('.card-detail .description').val());
            $.fancybox.close();
        });
        $('.card-detail .delete').click(function() {
            // TODO: ajax
            el.fadeOut('fast', function() {
                el.remove(); 
            });
            $.fancybox.close();
        });
    });
});
