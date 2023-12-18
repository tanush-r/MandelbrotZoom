let xmin, xmax, ymin, ymax

let centerX = -0.5999062500, centerY = -0.4290703125
let a,b,z,ca,cb,aa,bb,bright,n,pix

let centerXText, centerYText, centerXValue, centerYValue, zoomInButton, cancelZoomButton
let zoomFactorText, zoomFactorValue, maxIterationsText, maxIterationsValue, reloadButton
let zoomIn = false
let grid

let zoomFactor = 0.95
let maxIterations = 400

const resetBounds = () => {
    xmin = -2
    xmax = 1
    ymin = -2
    ymax = 0.3125 // for 16:9 aspect ratio
    // ymax = 2
}

function setup() {
    createCanvas(854, 480)
    pixelDensity(1)
    resetBounds()
    frDiv = createDiv('')

    centerXText = createElement('text','centreX')
    centerXValue = createInput('-0.5999062500')
    centerYText = createElement('text','centreY')
    centerYValue = createInput('-0.4290703125')
    zoomInButton = createButton('Zoom In')
    cancelZoomButton = createButton('Cancel Zoom')

    zoomFactorText = createElement('text','zoomFactor')
    zoomFactorValue = createInput('0.95')
    maxIterationsText = createElement('text','maxIterations')
    maxIterationsValue = createInput('400')
    reloadButton = createButton('Reload')

    centerXText.position(0,frDiv.y)
    centerXValue.position(70,frDiv.y)
    centerYText.position(290,frDiv.y)
    centerYValue.position(360,frDiv.y)
    zoomInButton.position(590,frDiv.y)
    cancelZoomButton.position(670,frDiv.y)

    zoomFactorText.position(0,height + 70)
    zoomFactorValue.position(100,height + 70)
    maxIterationsText.position(320,height + 70)
    maxIterationsValue.position(420,height + 70)
    reloadButton.position(640,height + 70)

    zoomInButton.mouseClicked(() => {
        centerX = float(centerXValue.value())
        centerY = float(centerYValue.value())
        zoomIn = true
    })

    cancelZoomButton.mouseClicked(() => {
        zoomIn = false
    })

    reloadButton.mouseClicked(() => {
        resetBounds()
        zoomIn = false
        zoomFactor = float(zoomFactorValue.value())
        maxIterations = float(maxIterationsValue.value())
        redraw();
    })
}

function draw() {
    loadPixels()
    for(var x = 0; x < width; x++) {
        for(var y = 0; y <  height;y++) {
            a = map(x, 0, width, xmin, xmax)
            b = map(y, 0, height, ymin, ymax)
            ca = a
            cb = b
            z = 0
            for(n = 0; n < maxIterations; n++) {
                aa = a*a  - b*b
                bb = 2*a*b

                a = aa + ca
                b = bb + cb

                if(a*a + b*b > 16) break
            }
            pix = (x + y * width) * 4;
            if(n == maxIterations) {
                bright = 0
                pixels[pix + 0] = 0
                pixels[pix + 1] = 0
                pixels[pix + 2] = 0
                pixels[pix + 3] = 255  
            } else {
                bright = map(n, 0, maxIterations, 0, 1)
                bright = map(sqrt(bright), 0, 1, 0, 255)
                pixels[pix + 0] = 255 - bright
                pixels[pix + 1] = 69 + bright
                pixels[pix + 2] = 0
                pixels[pix + 3] = 255   
            }       

        }
    }
    updatePixels()
    frDiv.html("Framerate: " + floor(frameRate()));

    if(zoomIn) {
        xmin = centerX - (xmax - centerX) * zoomFactor
        xmax = centerX + (xmax - centerX) * zoomFactor
        ymin = centerY - (ymax - centerY) * zoomFactor
        ymax = centerY + (ymax - centerY) * zoomFactor
    }
}
