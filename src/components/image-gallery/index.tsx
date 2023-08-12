import ReactImageGallery from "react-image-gallery";

interface ImageGalleryProps {
    imageURLs: {
        original: string;
        thumbnail: string;
    }[];
}

const ImageGallery = ({
    imageURLs,
}: ImageGalleryProps) => {
    return (
        <ReactImageGallery items={imageURLs} />
    );
};

export default ImageGallery;