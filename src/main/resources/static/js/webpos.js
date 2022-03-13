function ajaxAdd(event, id, amount) {
  event.preventDefault();
  $.ajax({
    url : `/cart/${id}?amount=${amount}`,
    method : "POST",
    success : (items) => {renderItems(items); ajaxRefreshOrder()},
    error : () => {}
  });
}

function ajaxRemove(event, id) {
  event.preventDefault();
  $.ajax({
    url : `/cart/${id}`,
    method : "DELETE",
    success : (items) => {renderItems(items); ajaxRefreshOrder()},
    error : () => {}
  });
}

function ajaxEmpty(event) {
  event.preventDefault();
  $.ajax({
    url : "/cart",
    method : "DELETE",
    success : (items) => {renderItems(items); ajaxRefreshOrder()},
    error : () => {}
  });
}

function ajaxCharge(event) {
  event.preventDefault();
  $.ajax({
    url : "/order",
    method : "POST",
    success : (order) => {alert(order.total.toFixed(2) + " dollars spent!"); renderOrder(order)},
    error : () => {}
  });
}

function ajaxRefreshOrder() {
  $.ajax({
    url : "/order",
    method : "GET",
    success : renderOrder,
    error : () => {}
  });
}

function renderOrder(order) {
  $("#tax").html((order.tax * 100).toFixed(1) + "%");
  $("#discount").html((order.discount * 100).toFixed(1) + "%");
  $("#sub-total").html("$" + order.subTotal.toFixed(2));
  $("#total").html("$" + order.total.toFixed(2));
}

const renderItems = (() => {
  // store existing items
  let icache = null;

  return (items) => {

    if (icache === null) {
      // get all existing items
      icache = new Set();
      $("[id^='row-']").each((i, r) => icache.add(r.id.substring(4)));
    }

    // used to render a new item
    const render = item => {
      const {id, name, image, price} = item.product;
      const {quantity} = item;
      // fragment copied from the template
      return  `<tr id="row-${id}">
          <td>
            <figure class="media">
              <div class="img-wrap">
                <img src="/images/items/${image}" class="img-thumbnail img-xs" />
              </div>
              <figcaption class="media-body">
                <h6 class="title text-truncate">
                  <span>${name}</span>
                </h6>
              </figcaption>
            </figure>
          </td>
          <td class="text-center">
            <div class="m-btn-group m-btn-group--pill btn-group mr-2" role="group" aria-label="...">
              <button type="button" class="m-btn btn btn-default" onclick="ajaxAdd(event, '${id}', -1)">
                <i class="fa fa-minus"></i>
              </button>
              <button type="button" class="m-btn btn btn-default" disabled="">
                <span id="qty-${id}">${quantity}</span>
              </button>
              <button type="button" class="m-btn btn btn-default" onclick="ajaxAdd(event, '${id}', 1)">
                <i class="fa fa-plus"></i>
              </button>
            </div>
          </td>
          <td>
            <div class="price-wrap">
              <var class="price">
                <span>$${price.toFixed(2)}</span>
              </var>
            </div>
            <!-- price-wrap .// -->
          </td>
          <td class="text-right">
            <a href="#" class="btn btn-outline-danger" onclick="ajaxRemove(event, '${id}')">
              <i class="fa fa-trash"></i>
            </a>
          </td>
        </tr>`;
    }

    // store the new set of products for checking
    const iset = new Set();

    // update, append or remove
    items.forEach(item => {
      const productId = item.product.id;
      iset.add(productId);
      if (icache.has(productId)) {
        // an existing item
        $(`#qty-${productId}`).text(item.quantity);
      } else {
        // a new one
        $("#cart-list").append(render(item));
      }
    });

    // check for existence
    icache.forEach(productId => {
      if (!iset.has(productId)) {
        // remove the item
        $(`#row-${productId}`).remove();
      }
    });

    // update cache
    icache = iset;
  }

})();
