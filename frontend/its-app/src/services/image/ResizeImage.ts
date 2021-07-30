export const ResizeImage = (image: string) => {
    const img = new Image();
    img.src = image;

    let height = window.screen.height / 3
    let width = window.screen.width / 3
    
    let H: number = height
    let W: number = width

    img.onload = function () {
        let imgWidth = img.naturalWidth;
        let imgHeight = img.naturalHeight;
        // console.log("imgWidth",imgWidth,":::::","imgHeight",imgHeight)
        if (height < imgHeight || width < imgWidth) {
            if (height < imgHeight && width < imgWidth) {
                H = imgHeight / (imgHeight / height)
                W = imgWidth / (imgWidth / width)
            }
            if (height < imgHeight) {
                H = height
                W = imgWidth / (imgWidth / width)
            }
            if (width < imgWidth) {
                H = imgHeight / (imgHeight / height)
                W = width

            }
        }
    };

    console.log("width",W,":::::","height",H)

    return { height: H, width: W }

}






