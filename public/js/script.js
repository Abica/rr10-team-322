$(function() {
    var UUID = location.pathname.match(/\/([^\/]+)/)[1];

    function extractId(el) {
      return ($(el).attr("id").match(/-(\d+)$/) || [])[1];
    }

    $('tr td:last-child, tr th:last-child').addClass('last');

    /** drag drop */
    dragOptions = {
        revert: 'invalid',
        helper: function(e) {
            var el = $(e.target);
            if(el.hasClass('content')) {
                 el = el.parent();
            }
            el.css('left', el.offset().left)
              .css('top', el.offset().top)
              .width(el.width())
              .css('position', 'absolute')

            return el;
        },
        stop: function(e, ui) {
            var el = $(ui.draggable);
            el.removeClass('ui-draggable-dragging')
                      .removeClass('ui-draggable')
                      .css('top', 'auto')
                      .css('left', 'auto')
                      .css('position', 'relative')
                      .css('width', 'auto')
                      .draggable(dragOptions);
         
        }
    };
    dropOptions = {
        drop: function(event, ui) {
            var el = $(ui.draggable).clone();
            var cardId = extractId(el);
            if (el.hasClass("in-backlog") || /swim-lane/.test($(this).attr("id"))) {
              var laneId = extractId($(this));
              var parentTr = $(this).parents("tr")[0];
              if (parentTr) {
                var laneStatus = parentTr.className;

                $.post("/" + UUID + "/card/" + cardId + "/to-swim-lane/" + laneId + "/" + laneStatus);
                el.removeClass('in-swim-lane').addClass('in-backlog');
              }
            } else {
              $.post("/" + UUID + "/card/" + cardId + "/to-backlog");
              el.removeClass('in-backlog').addClass('in-swim-lane');
            }

            $(this).append(el);
            el.removeClass('ui-draggable-dragging')
              .removeClass('ui-draggable')
              .css('top', 'auto')
              .css('left', 'auto')
              .css('position', 'relative')
              .css('width', 'auto')
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
    $('nav button:not(.add)').live('click', function() {
        window.location = '/'+UUID+'/show/'+extractId(this);
    });
    $('nav .add').live('click', function() {
        $.fancybox($('.sprint-new'));
        $('.sprint-new input').focus();
    });
    $('.sprint-new input').live('keypress', function(event) {
        if(event.keyCode == 13) {
            $('.sprint-new .save').trigger('click');
        }
    });
    $('.about-cardwall .remove').live('click', function() {
        $.ajax({ 
            type: "DELETE", 
            url: "/" + UUID + "/sprint/" + extractId('.about-cardwall'),
            success: function(data) {
                window.location = '/'+UUID;
            }
        });
    });
    $('.sprint-new .save').click(function() {
        var post = { sprint: {
            name: $('.sprint-new .name').val(),
            description: ''
        }};
        $.post('/'+UUID+'/sprint', post, function(data) {
            $("<button/>").html($('.sprint-new .name').val())
                          .attr('id', 'switch-sprint-'+data.id)
                          .insertBefore('nav .add');
            $.fancybox.close();
        });
    });
    $('.sprint-new .cancel').click($.fancybox.close);
    /** end sprint management */

    /** lane management */
    $('.about-cardwall .add').live('click', function() {
        var sprint_id = extractId('.about-cardwall');
        var position = $('.cardwall tr th').length-1;
        var post = { swim_lane : {
            name: "New Lane",
            description: "",
            position: position
        }};
        $.post('/'+UUID+'/sprint/'+sprint_id+'/swim_lane', post,
        function(data) {
            
            var el = $("<th id='header-swim-lane-"+data.id+"'><span class='lane-title'>New Lane</span><button class='icon delete'>Delete</button></th>");
            $('.cardwall tr:first').append(el);
            $('.cardwall tr:not(:first)').each(function(i, v) {
                var td = $("<td />");
                if(i == 0) {
                    td.attr("id", "expedited-swim-lane-"+data.id);
                } else {
                    td.attr("id", "regular-swim-lane-"+data.id);
                }
                $(v).append(td);
                td.droppable(dropOptions);
            });
            $(window).scrollLeft(9999);
            el.droppable(dropOptions);
            $('tr td, tr th').removeClass('last');
            $('tr td:last-child, tr th:last-child').addClass('last');
        });
    });
    $('.cardwall th .delete').live('click', function() {
        var col = 0;
        var column = $(this).parent()[0];
        var laneId = extractId($(this).parent());

        $.ajax({ type: "DELETE", url: "/" + UUID + "/swim_lane/" + laneId });

        $('.cardwall th').each(function(i, el) {
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
    $('.lane-title-edit').live('keypress', function(event) {
        if(event.keyCode == 13) {
            $('.lane-title-edit').trigger('blur');
        }
    });
    $('.lane-title-edit').live('blur', function() {
        var name = $(this).val();
        var laneId = extractId($(this).parent());

        $.post("/" + UUID + "/swim_lane/" + laneId, {swim_lane: {name: name}});
        $(this).replaceWith(
            $('<span/>').addClass('lane-title').html(name)
        );
    });
    /** end lane management */
    /** Backlog management */
    $('#backlog .add').live('click', function() {
        $.fancybox($('.card-new'));
        $('.card-new textarea').focus();
    });
    $('.card-new .cancel').click($.fancybox.close);
    $('.card-new .save').click(function() {
        var description = $('.card-new .description').val();
        var el = $("<div class='card'></div>").append(
                $("<button class='card_delete'>Delete</button>")
            ).append(
                $("<div class='content'></div>").html(description)
            );
        $('#backlog .backlog-box').append(el);
        $.post("/" + UUID + "/card", {card: {description: description}});

        $.fancybox.close();
    });
    /** end backlog */


    $('.card button').live('click', function() {
        var el = $(this).parent();
        var cardId = extractId(el);
        $.ajax({ type: "DELETE", url: "/" + UUID + "/card/" + cardId });
        el.fadeOut('fast', function() {
            el.remove();
        });
    });
    $('.card textarea').live('blur', function() {
        var cardId = extractId($(this).parent().parent());
        var description = $(this).val();
        $.post("/" + UUID + "/card/" + cardId, {card: {description: description}});
        if(description.length == 0) {
            description = "&nbsp;";
        }
        $(this).parent().html(description);
    });
    $('.card .content').live('click', function() {
        var el = $(this);
        var text = $("<textarea></textarea>").val(el.html());
        el.html(text);
        text.focus().select().autoResize();
    });
});
