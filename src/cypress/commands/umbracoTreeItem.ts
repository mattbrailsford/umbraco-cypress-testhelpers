﻿import CommandBase from './commandBase';

export default class UmbracoTreeItem extends CommandBase {
  _commandName = 'umbracoTreeItem';

  method(treeName, itemNamePathArray) {
    const cy = this.cy;
    const cypress = this.cypress;

    cy.get('li > .umb-tree-root a[href$=' + treeName + ']', {
      log: false,
    }).then(($root) => {
      return this.findItem($root.closest('li'), itemNamePathArray, 0);
    });

    cypress.log({
      displayName: 'Umbraco Tree Item',
      message: treeName + ': ' + itemNamePathArray.join(' -> '),
    });
  }

  findItem(parentElement, items, index) {
    const itemName = items[index];

    const menuItems = parentElement.find('li');

    let foundItem = null;
    for (const mi of menuItems) {
      const menuItem = cy.$$(mi);

      if (menuItem.find('.umb-tree-item__label').text() === itemName) {
        foundItem = menuItem;
        break;
      }
    }

    if (items.length === index + 1) {
      return foundItem;
    } else if (foundItem != null) {
      const li = foundItem.closest('li');
      li.find('[data-element="tree-item-expand"]').click();
      return cy
        .wrap(li.find('ul'))
        .should('not.have.class', 'collapsed')
        .then((xx) => {
          return this.findItem(li.find('ul'), items, index + 1);
        });
    } else {
      return null;
    }
  }
}
