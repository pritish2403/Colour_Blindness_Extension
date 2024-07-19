function createColorNameBox() {
    let boxElement = document.getElementById('colorNameBox');
    if (!boxElement) {
        boxElement = document.createElement('div');
        boxElement.id = 'colorNameBox';
        boxElement.style.position = 'absolute';
        boxElement.style.border = '1px solid black';
        boxElement.style.backgroundColor = 'white';
        boxElement.style.padding = '5px';
        boxElement.style.zIndex = '10000'; // Ensure it's above other page content
        document.body.appendChild(boxElement);
    }
    return boxElement;
}

function getColorAtPixel(imgData, x, y) {
    const index = (x + y * imgData.width) * 4;
    const r = imgData.data[index];
    const g = imgData.data[index + 1];
    const b = imgData.data[index + 2];
    return { r, g, b };
}

document.addEventListener('mousemove', function(event) {
    const boxElement = createColorNameBox(); // Efficiently checks if already exists
    if (event.target.tagName === 'IMG') {
        let canvas = event.target.canvas;
        if (!canvas) {
            canvas = document.createElement('canvas');
            event.target.canvas = canvas;
            canvas.width = event.target.naturalWidth;
            canvas.height = event.target.naturalHeight;
            const context = canvas.getContext('2d');
            context.drawImage(event.target, 0, 0, canvas.width, canvas.height);
        }

        const rect = event.target.getBoundingClientRect();
        const x = Math.floor(event.clientX - rect.left);
        const y = Math.floor(event.clientY - rect.top);
        if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) {
            const context = canvas.getContext('2d');
            const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
            const { r, g, b } = getColorAtPixel(imgData, x, y);
            const hexColor = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
            console.log('Hex Color:', hexColor); // Debug: Log the Hex color string

            // Use ntc.js with the hex color string
            const colorInfo = ntc.name(hexColor);
            const colorName = colorInfo[1]; // ntc.name returns [hex, name, exactmatch]
            console.log('Color Name:', colorName); // Debug: Log the color name

            boxElement.innerText = colorName || 'Invalid Color'; // Display 'Invalid Color' if no name returned
            boxElement.style.left = `${event.clientX + 15}px`;
            boxElement.style.top = `${event.clientY + 15}px`;
            boxElement.style.display = 'block';
        } else {
            boxElement.style.display = 'none';
        }
    } else {
        boxElement.style.display = 'none';
    }
});
