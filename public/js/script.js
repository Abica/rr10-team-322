$(function() {
    $('tr td:last-child, tr th:last-child').addClass('last');

    /** drag drop */
    dragOptions = {
        revert: 'invalid',
    };
    dropOptions = {
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
    };
    $('.card').live('mouseover', function() {
        $(this).draggable(dragOptions);
    });
    $('.cardwall td, .backlog-box').droppable(dropOptions);
    /** end drag drop */

    /** sprint management */
    $('nav .add').live('click', function() {
        $.fancybox($('.sprint-new'));
    });
    $('.sprint-new .save').click(function() {
        $("<button/>").html($('.sprint-new .name')
                      .val())
                      .insertBefore('nav .add');
        $.fancybox.close();
    });
    $('.sprint-new .cancel').click($.fancybox.close);
    /** end sprint management */

    /** lane management */
    $('.about-cardwall .add').live('click', function() {
        var el = $("<th><span class='lane-title'>New Lane</span><button class='icon delete'>Delete</button></th>");
        $('.cardwall tr:first').prepend(el);
        $('.cardwall tr:not(:first)').prepend("<td/>").droppable(dropOptions);
        el.droppable(dropOptions);
    });
    $('.cardwall th .delete').live('click', function() {
        var col = 0;
        var column = $(this).parent()[0];
        $('.cardwall th').each(function(i, el) {
            console.debug(el);
            console.debug(column);
            if(el == column) {
                col = i+1;
                return false;
            }
        });
        $(column).fadeOut('fast', function() {
            $('.cardwall tr td:nth-child('+col+'), .cardwall tr th:nth-child('+col+')').remove();
            $('tr td:last-child, tr th:last-child').addClass('last');
        });
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
            $('<span/>').addClass('lane-title').html($(this).val())
        );
    });
    /** end lane management */
    /** Backlog management */
    $('#backlog .add').live('click', function() {
        $.fancybox($('.card-new'));
    });
    $('.card-new .cancel').click($.fancybox.close);
    $('.card-new .save').click(function() {
        var description = $('.card-new .description').val());
        // TODO: ajax
        var el = $("<div/>").addClass("card")
                            .html(description);
        $('#backlog .backlog-box').append(el);
        $.fancybox.close();
    });
    /** end backlog */

    $('.card').live('click', function() {
        var el = $(this);
        $.fancybox($('.card-detail'));
        $('.card-detail .description').val(el.html());
        $('.card-detail .save').unbind('click').click(function() {
            // TODO: ajax
            el.html($('.card-detail .description').val());
            $.fancybox.close();
        });
        $('.card-detail .delete').unbind('click').click(function() {
            // TODO: ajax
            el.fadeOut('fast', function() {
                el.remove();
            });
            $.fancybox.close();
        });
    });
});
