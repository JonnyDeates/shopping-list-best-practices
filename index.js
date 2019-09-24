'use strict';

const STORE = {
    items: [
        {
            id: cuid(), name: "apples", checked: false, editing: false
        }
        ,
        {
            id: cuid(), name: "oranges", checked: false, editing: false
        }
        ,
        {
            id: cuid(), name: "milk", checked: true, editing: false
        }
        ,
        {
            id: cuid(), name: "bread", checked: false, editing: false
        }
    ],
    hideCheckedItems: false
};


function generateItemElement(item) {
    return `
    <li data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''} ${item.editing ? "disabled" : ''}">${item.name}</span>
      <input type="text" name="shopping-list-editor" class="js-shopping-list-editor ${item.editing ? "" : 'disabled'}" placeholder="${item.name}">
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));

    return items.join("");
}


function renderShoppingList() {
    // render the shopping list in the DOM
    let items = '';
    if (STORE.hideCheckedItems) {
        items = generateShoppingItemsString(STORE.items.filter((item) => item.checked === true))
    } else {
        items = generateShoppingItemsString(STORE.items);
    }
    // insert that HTML into the DOM
    $('.js-shopping-list').html(items);
}


function addItemToShoppingList(itemName) {
    STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function (event) {
        event.preventDefault();
        const newItemName = $('.js-shopping-list-entry').val();
        $('.js-shopping-list-entry').val('');
        addItemToShoppingList(newItemName);
        renderShoppingList();
    });
}

function getItemIdFromElement(item) {
    return $(item).closest('li').data('item-id');
}

function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
        const itemId = getItemIdFromElement(event.currentTarget);
        let item = STORE.items.find((item) => item.id === itemId);
        item.checked = !item.checked;
        renderShoppingList();
    });
}
function handleItemEditClicked() {
    $('.js-shopping-list').on('click', `.js-item-edit`, event => {
        const itemId = getItemIdFromElement(event.currentTarget);
        let item = STORE.items.find((item) => item.id === itemId);
        item.editing = !item.editing;
        let editor = event.target.closest('li').getElementsByClassName('js-shopping-list-editor')[0].value.trim();
        if(editor !== '') {
            item.name = editor;
        }
        renderShoppingList();

    });
}

function handleDeleteItemClicked() {
    $('.js-shopping-list').on('click', `.js-item-delete`, event => {
        const itemId = getItemIdFromElement(event.currentTarget);
        let item = STORE.items.find((item) => item.id === itemId);
        STORE.items.splice(STORE.items.indexOf(item), 1);
        renderShoppingList();
    });
}

function toggleCheckedItemsFilter() {
    $('#js-shopping-list-toggleChecked').on('click', event => {
        STORE.hideCheckedItems = !STORE.hideCheckedItems;
        renderShoppingList();
    });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
    renderShoppingList();
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleItemEditClicked();
    handleDeleteItemClicked();
    toggleCheckedItemsFilter();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);