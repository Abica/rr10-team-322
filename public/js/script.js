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
            el.css('left', el.offset().left)
              .css('top', el.offset().top)
              .width(el.width())
              .css('position', 'absolute')

            return el;
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
              .css('position', 'static')
              .css('width', 'auto')
              .draggable(dragOptions);
            $(ui.draggable).remove();
            console.log("SDSDDS");
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
            $('.cardwall tr:not(:first)').append("<td/>").droppable(dropOptions);
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
    });
    $('.card-new .cancel').click($.fancybox.close);
    $('.card-new .save').click(function() {
        var description = $('.card-new .description').val();
        var el = $("<div/>").addClass("card")
                            .html(description);
        $('#backlog .backlog-box').append(el);
        $.post("/" + UUID + "/card", {card: {description: description}});

        $.fancybox.close();
    });
    /** end backlog */

    $('.card').live('click', function() {
        var el = $(this);
        var cardId = extractId(el);
        $.fancybox($('.card-detail'));
        $('.card-detail .description').val(el.html());
        $('.card-detail .save').unbind('click').click(function() {
            var description = $('.card-detail .description').val();
            el.html(description);
            $.post("/" + UUID + "/card/" + cardId, {card: {description: description}});
            $.fancybox.close();
        });
        $('.card-detail .delete').unbind('click').click(function() {
            $.ajax({ type: "DELETE", url: "/" + UUID + "/card/" + cardId });
            el.fadeOut('fast', function() {
                el.remove();
            });
            $.fancybox.close();
        });
    });
});
