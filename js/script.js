$(function () { // Same as document.addEventListener("DOMContentLoaded"...

(function (global) {

var dc = {};

var homeHtml = "snippets/main_page.html";
var bands =
  "data/list_of_bands.json";
var main_page_title = "main_page_header.html";
var mainpageHtml = "snippets/main_page.html";
var menuItemsUrl =
  "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}

// Using categories data and snippets html
// build categories view HTML to be inserted into page

function buildMainPageHeaderHtml() {
  var finalHtml = main_page_title;
  return finalHtml;
}


function buildMainPageViewHtml(bands,
  main_page_Html) {
  var finalHtml = "";
  // Loop over bands
  for (var i = 0; i < Object.keys(bands).length; i++) {
    // Insert category values
    var html = main_page_Html;
    var name = "" + bands[toString(i)].name;
    var yl = bands[toString(i)].youtube_link;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "youtube_link",
                     yl);
    finalHtml += html;
  }
  return finalHtml;
}

// Builds HTML for the categories page based on the data
// from the server
function buildAndShowMainPageHTML (bands) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    main_page_title,
      $ajaxUtils.sendGetRequest(
        mainpageHtml,
        function (mainpageHtml) {
          insertHtml("head", buildMainPageHeaderHtml())

          var mainPageViewHtml = buildMainPageViewHtml(bands, mainpageHtml);
          insertHtml("#main-content", mainPageViewHtml);
        }, 
        false),
    false);
}



// On first load, show home view
showLoading("#main-content");
buildAndShowMainPageHTML(bands)



// // Load the menu categories view
// dc.loadMainPageCategories = function () {
//   showLoading("#main-content");
//   $ajaxUtils.sendGetRequest(
//     allBands,
//     buildAndShowMainPageHTML);
// };


// // Load the menu items view
// // 'categoryShort' is a short_name for a category
// dc.loadMenuItems = function (categoryShort) {
//   showLoading("#main-content");
//   $ajaxUtils.sendGetRequest(
//     menuItemsUrl + categoryShort,
//     buildAndShowMenuItemsHTML);
// };

// Builds HTML for the single category page based on the data
// from the server
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}


// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_small",
                      menuItems[i].price_small);
    html =
      insertItemPortionName(html,
                            "small_portion_name",
                            menuItems[i].small_portion_name);
    html =
      insertItemPrice(html,
                      "price_large",
                      menuItems[i].price_large);
    html =
      insertItemPortionName(html,
                            "large_portion_name",
                            menuItems[i].large_portion_name);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
    html =
      insertProperty(html,
                     "description",
                     menuItems[i].description);

    // Add clearfix after every second menu item
    if (i % 2 != 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Appends price with '$' if price exists
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");;
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}


global.$dc = dc;

})(window)});