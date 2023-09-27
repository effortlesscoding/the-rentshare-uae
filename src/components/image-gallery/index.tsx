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
    const showPagination = imageURLs.length > 1;
    return (
        <GalleryStyles>
            <ReactImageGallery
                items={imageURLs}
                showBullets={showPagination}
                showPlayButton={showPagination}
                showThumbnails={showPagination}
            />
        </GalleryStyles>
    );
};

export default ImageGallery;