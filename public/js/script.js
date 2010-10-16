$(function() {
    $('tr td:last-child, tr th:last-child').addClass('last');
    
    dragOptions = {
        revert: 'invalid',
        snap: '.cardwall td',
        snapMode: 'inner'
    };
    $('.card').draggable(dragOptions);
    $('.cardwall td').droppable({
        drop: function(event, ui) {
        }
    });
});
