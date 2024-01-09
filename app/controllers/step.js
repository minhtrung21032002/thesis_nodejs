function renderStepsThumbList() {}

document.addEventListener('DOMContentLoaded', function () {
    let isDraggingEnabled = false;

    const draggableList = new Draggable.Sortable(document.querySelectorAll('#draggable-list'), {
        draggable: '.draggable-item',
        mirror: {
            constrainDimensions: true,
        },
        // plugins: [Draggable.Plugins.Sortable],
        classes: {
            mirror: 'draggable-mirror',
        },
        dragClass: 'sortable-source--is-dragging',
    });

    draggableList.on('sortable:start', event => {
        // Check if dragging is enabled before allowing the drag to start
        if (!isDraggingEnabled) {
            event.cancel();
        }
    });

    draggableList.on('sortable:stop', event => {
        // Handle the drop event as needed
        const draggedItem = event.data.dragEvent.source;
        const itemId = draggedItem.getAttribute('data-id');
        console.log('Dropped item with ID:', itemId);
    });

    document.querySelector('.rearrange-steps-button').addEventListener('click', function () {
        isDraggingEnabled = !isDraggingEnabled;
        console.log(isDraggingEnabled);
    });
});
