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
    success : (order) => {alert(order.total.toFixed(2) + "$ spent!"); renderOrder(order)},
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
  $("#tax").html(order.tax * 100 + "%");
  $("#discount").html(order.discount * 100 + "%");
  $("#sub-total").html("$" + order.subTotal.toFixed(2));
  $("#total").html("$" + order.total.toFixed(2));
}

// rerender the item list, inefficient
function renderItems(items) {

  function renderItem(item) {
    const {id, name, image, price} = item.product;
    const {quantity} = item;
    // fragment copied from the template
    return  `<tr>
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
                  <span>${quantity}</span>
                </button>
                <button type="button" class="m-btn btn btn-default" onclick="ajaxAdd(event, '${id}', 1)">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </td>
            <td>
              <div class="price-wrap">
                <var class="price">
                  <span>$${price}</span>
                </var>
              </div>
              <!-- price-wrap .// -->
            </td>
            <td class="text-right">
              <a href="" class="btn btn-outline-danger" onclick="ajaxRemove(event, '${id}')">
                <i class="fa fa-trash"></i>
              </a>
            </td>
          </tr>`;
  }

  let cartHtml = "";
  $.each(items, (idx, item) => {
    cartHtml = `${cartHtml}${renderItem(item)}`
  });
  $("#cart-list").html(cartHtml);
}

