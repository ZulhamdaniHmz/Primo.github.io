


function toggleMenu() {
  document.querySelector('nav ul').classList.toggle('show');
}

// Shop Add to Cart logic with cart preview
document.addEventListener('DOMContentLoaded', function() {
  // Shop search bar live filtering
  var searchInput = document.getElementById('productSearch');
  var clearBtn = document.getElementById('clearSearch');
  var productGrid = document.querySelector('.product-grid');
  if (searchInput && productGrid) {
    searchInput.addEventListener('input', function() {
      var val = searchInput.value.toLowerCase();
      var cards = productGrid.querySelectorAll('.product-card');
      cards.forEach(function(card) {
        var name = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        card.style.display = name.includes(val) ? '' : 'none';
      });
      clearBtn.style.display = val ? 'block' : 'none';
    });
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        var cards = productGrid.querySelectorAll('.product-card');
        cards.forEach(function(card) { card.style.display = ''; });
        clearBtn.style.display = 'none';
        searchInput.focus();
      });
    }
  }
  // Large preview modal logic
  var previewBtn = document.getElementById('previewLargeBtn');
  var modal = document.getElementById('largePreviewModal');
  var closeModal = document.getElementById('closeLargePreview');
  var tshirtImg = document.getElementById('tshirtImage');
  var uploadedImg = document.getElementById('uploadedImage');
  var largeTshirtImg = document.getElementById('largeTshirtImage');
  var largeUploadedImg = document.getElementById('largeUploadedImage');
  if (previewBtn && modal && closeModal && tshirtImg && uploadedImg && largeTshirtImg && largeUploadedImg) {
    previewBtn.addEventListener('click', function() {
      modal.style.display = 'flex';
      largeTshirtImg.src = tshirtImg.src;
      if (uploadedImg.src && uploadedImg.style.display !== 'none') {
        largeUploadedImg.src = uploadedImg.src;
        largeUploadedImg.style.display = 'block';
        // Use same size and transform as editor
        largeUploadedImg.style.width = uploadedImg.style.width;
        largeUploadedImg.style.height = uploadedImg.style.height;
        largeUploadedImg.style.left = '50%';
        largeUploadedImg.style.top = '50%';
        largeUploadedImg.style.transform = uploadedImg.style.transform;
      } else {
        largeUploadedImg.style.display = 'none';
      }
    });
    closeModal.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
  // Custom Design Add to Cart
  var addCustomBtn = document.getElementById('addCustomToCart');
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', function() {
      var color = document.getElementById('color') ? document.getElementById('color').value : 'white';
      var size = document.getElementById('size') ? document.getElementById('size').value : 'M';
      var uploadedImg = document.getElementById('uploadedImage');
      var imgSrc = uploadedImg && uploadedImg.src && uploadedImg.style.display !== 'none' ? uploadedImg.src : '';
      if (!imgSrc) {
        alert('Please upload your design image first!');
        return;
      }
      loadCart();
      cart.push({ name: 'Custom T-Shirt', size: size, color: color, img: imgSrc, qty: 1 });
      saveCart();
      if (cartCountEl) cartCountEl.textContent = getCartCount();
      alert('Your custom design has been added to the cart!');
      updateCartPreview && updateCartPreview();
    });
  }
  var cartCountEl = document.getElementById('cartCount');
  var addToCartButtons = document.querySelectorAll('.add-to-cart');
  var cartItemsEl = document.getElementById('cartItems');
  var cartEmptyEl = document.getElementById('cartEmpty');
  var cartPreviewEl = document.getElementById('cartPreview');
  var cart = [];

    // Outside click to close cart preview
    document.addEventListener('mousedown', function(e) {
      if (!cartPreviewEl) return;
      if (cartPreviewEl.style.display !== 'none') {
        // If click is outside cartPreview and not on cart icon
        var cartIcon = document.querySelector('.cart-container img');
        if (!cartPreviewEl.contains(e.target) && (!cartIcon || e.target !== cartIcon)) {
          cartPreviewEl.style.display = 'none';
        }
      }
    });

  // Load cart from localStorage
  function loadCart() {
    var stored = localStorage.getItem('cart');
    if (stored) {
      try {
        cart = JSON.parse(stored);
      } catch (e) {
        cart = [];
      }
    } else {
      cart = [];
    }
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function getCartCount() {
  return cart.reduce(function(sum, item) { return sum + (item.qty || 1); }, 0);
  }

  loadCart();
  if (cartCountEl) cartCountEl.textContent = getCartCount();

  if (addToCartButtons.length) {
    addToCartButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var card = btn.closest('.product-card');
        var name = card ? card.querySelector('h3').textContent : 'T-Shirt';
        var sizeSel = card ? card.querySelector('select') : null;
        var size = sizeSel ? sizeSel.value : 'M';
        var img = card ? card.querySelector('img') : null;
        var imgSrc = img ? img.getAttribute('src') : '';
        // Check if item with same name, size, img exists
        var found = cart.find(function(it) {
          return it.name === name && it.size === size && it.img === imgSrc;
        });
        if (found) {
          found.qty = (found.qty || 1) + 1;
        } else {
          cart.push({ name: name, size: size, img: imgSrc, qty: 1 });
        }
        saveCart();
        if (cartCountEl) cartCountEl.textContent = getCartCount();
        btn.textContent = 'Added!';
        setTimeout(function() {
          btn.textContent = 'Add to Cart';
        }, 1200);
        updateCartPreview();
      });
    });
  }

  window.toggleCartPreview = function() {
    if (!cartPreviewEl) return;
    cartPreviewEl.style.display = cartPreviewEl.style.display === 'none' ? 'block' : 'none';
    updateCartPreview();
  };

  function updateCartPreview() {
    loadCart();
    if (!cartItemsEl || !cartEmptyEl) return;
    cartItemsEl.innerHTML = '';
    var total = 0;
    if (cart.length === 0) {
      cartEmptyEl.style.display = 'block';
    } else {
      cartEmptyEl.style.display = 'none';
      cart.forEach(function(item, i) {
        var li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.gap = '0.7em';
        var img = document.createElement('img');
        img.src = item.img || '';
        img.alt = item.name;
        img.style.width = '38px';
        img.style.height = '38px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        var span = document.createElement('span');
        span.textContent = item.name + ' (' + item.size + ')';
        // Quantity controls
        var qtyDiv = document.createElement('div');
        qtyDiv.style.display = 'flex';
        qtyDiv.style.alignItems = 'center';
        qtyDiv.style.gap = '0.2em';
        var minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.style.width = '24px';
        minusBtn.style.height = '24px';
        minusBtn.onclick = function() {
          if (item.qty > 1) {
            item.qty--;
          } else {
            cart.splice(i, 1);
          }
          saveCart();
          if (cartCountEl) cartCountEl.textContent = getCartCount();
          updateCartPreview();
        };
        var qtySpan = document.createElement('span');
        qtySpan.textContent = item.qty || 1;
        qtySpan.style.minWidth = '18px';
        qtySpan.style.textAlign = 'center';
        var plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.style.width = '24px';
        plusBtn.style.height = '24px';
        plusBtn.onclick = function() {
          item.qty = (item.qty || 1) + 1;
          saveCart();
          if (cartCountEl) cartCountEl.textContent = getCartCount();
          updateCartPreview();
        };
        qtyDiv.appendChild(minusBtn);
        qtyDiv.appendChild(qtySpan);
        qtyDiv.appendChild(plusBtn);
        var btn = document.createElement('button');
        btn.textContent = 'Remove';
        btn.className = 'remove-cart-item';
        btn.onclick = function() {
          cart.splice(i, 1);
          saveCart();
          if (cartCountEl) cartCountEl.textContent = getCartCount();
          updateCartPreview();
        };
        li.appendChild(img);
        li.appendChild(span);
        li.appendChild(qtyDiv);
        li.appendChild(btn);
        cartItemsEl.appendChild(li);
        // Calculate total price (hardcoded for now)
        var price = item.name.includes('Kuuga') ? 19.99 : 24.99;
        total += price * (item.qty || 1);
      });
      // Show total price
      var totalDiv = document.createElement('div');
      totalDiv.style.textAlign = 'right';
      totalDiv.style.fontWeight = 'bold';
      totalDiv.style.marginTop = '0.7em';
      totalDiv.textContent = 'Total: $' + total.toFixed(2);
      cartItemsEl.appendChild(totalDiv);
      // Add checkout button
      var checkoutBtn = document.createElement('button');
      checkoutBtn.textContent = 'Checkout';
      checkoutBtn.style.marginTop = '0.7em';
      checkoutBtn.style.width = '100%';
      checkoutBtn.style.background = '#ff4d4d';
      checkoutBtn.style.color = '#fff';
      checkoutBtn.style.fontWeight = 'bold';
      checkoutBtn.style.border = 'none';
      checkoutBtn.style.borderRadius = '6px';
      checkoutBtn.style.padding = '0.7em';
      checkoutBtn.onclick = function() {
        window.location.href = 'checkout.html';
      };
      cartItemsEl.appendChild(checkoutBtn);
    }
  }
  // Always enable cart preview toggle
  window.toggleCartPreview = window.toggleCartPreview;
  // Show cart preview with latest items on page load
  updateCartPreview();
});

/* design script */

function toggleMenu() {
    document.querySelector('nav ul').classList.toggle('show');
  }

  function resetDesign() {
    const uploadedImage = document.getElementById('uploadedImage');
    uploadedImage.src = '';
    uploadedImage.style.display = 'none';
    document.getElementById('color').value = 'white';
    changeColor();
   }
     
    function changeColor() {
      const color = document.getElementById('color').value;
      const tshirtImage = document.getElementById('tshirtImage');
      tshirtImage.src = `gildan ${color}.png`;
    }

    function previewImage(event) {
      const uploadedImage = document.getElementById('uploadedImage');
      uploadedImage.src = URL.createObjectURL(event.target.files[0]);
      uploadedImage.style.display = 'block';
      uploadedImage.style.width = '150px';
      uploadedImage.style.height = 'auto';
    }

    // Make uploaded image draggable and resizable
        interact('#uploadedImage')
    .draggable({
        modifiers: [
        interact.modifiers.restrictRect({
            restriction: 'parent', // Keep it inside the parent (.tshirt-preview)
            endOnly: true
        })
        ],
        inertia: true,
        onmove: dragMoveListener
    })
    .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        preserveAspectRatio: true,
        modifiers: [
        interact.modifiers.restrictSize({
            min: { width: 50, height: 50 },
            max: { width: 300, height: 300 }
        })
        ],
        inertia: true
    })
    .on('resizemove', function (event) {
        const target = event.target;
        let { width, height } = event.rect;

        target.style.width = `${width}px`;
        target.style.height = `${height}px`;

        let x = (parseFloat(target.dataset.x) || 0) + event.deltaRect.left;
        let y = (parseFloat(target.dataset.y) || 0) + event.deltaRect.top;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.dataset.x = x;
        target.dataset.y = y;
    });

    function dragMoveListener(event) {
      const target = event.target;

      let x = (parseFloat(target.dataset.x) || 0) + event.dx;
      let y = (parseFloat(target.dataset.y) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.dataset.x = x.toString();
      target.dataset.y = y.toString();
    }

      // Save the Design as PNG
    function saveDesign() {
      const tshirtPreview = document.getElementById('tshirtPreview');
      // Create a hidden clone for clean export
      const clone = tshirtPreview.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.zIndex = '-1';
      document.body.appendChild(clone);
      // Remove any buttons, instructions, or extra UI from clone
      Array.from(clone.querySelectorAll('button, [id^="cart"], .cart-container, .hamburger, [id^="previewLargeBtn"], [id^="largePreviewModal"]')).forEach(el => el.remove());
      // Optionally remove drag instructions
      Array.from(clone.querySelectorAll('div')).forEach(el => {
        if (el.textContent && el.textContent.includes('Drag your design')) el.remove();
      });
      html2canvas(clone, { backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'custom-tshirt.png'; // File name
        link.href = canvas.toDataURL('image/png');
        link.click();
        document.body.removeChild(clone);
      });
    }

    // Required for older browsers
    window.dragMoveListener = dragMoveListener;

    /* design script */


    /* shop script */

    
