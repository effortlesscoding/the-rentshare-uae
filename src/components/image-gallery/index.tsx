import ReactImageGallery from "react-image-gallery";
import styled from '@emotion/styled';

interface ImageGalleryProps {
    imageURLs: {
        original: string;
        thumbnail: string;
    }[];
}

const GalleryStyles = styled.div`
    width: 100%;
    .image-gallery {
        width: 100%;
    }

    .image-gallery-slide {
        background-color: #ececec;
    }

    .image-gallery-content:not(.fullscreen  ) .image-gallery-slide img {
        height: 400px;
    }
`

const ImageGallery = ({
    imageURLs,
}: ImageGalleryProps) => {
    return (
        <GalleryStyles>
            <ReactImageGallery
                items={imageURLs}
                showBullets={imageURLs.length > 1}
                showPlayButton={imageURLs.length > 1}
                showThumbnails={imageURLs.length > 1}
            />
        </GalleryStyles>
    );
};

export default ImageGallery;