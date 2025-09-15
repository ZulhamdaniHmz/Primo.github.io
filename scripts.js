


 function toggleMenu() {
    document.querySelector('nav ul').classList.toggle('show');
  }

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

      html2canvas(tshirtPreview, { backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'custom-tshirt.png'; // File name
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }

    // Required for older browsers
    window.dragMoveListener = dragMoveListener;

    /* design script */


    /* shop script */

    
